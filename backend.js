const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const RpsGame = require('./rps-game');

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backEndPlayers = {}

const SPEED = 10

let waitingPlayer = null;

io.on('connection', (socket) => {

  if (waitingPlayer) {
    new RpsGame(waitingPlayer, socket);
    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
  }

  console.log('a user connected');
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    sequenceNumber: 0
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  });

  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch (keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= SPEED
        break

      case 'KeyA':
        backEndPlayers[socket.id].x -= SPEED
        break

      case 'KeyS':
        backEndPlayers[socket.id].y += SPEED
        break

      case 'KeyD':
        backEndPlayers[socket.id].x += SPEED
        break
    }
  })

  socket.on('eliminateLastImage', (player)=>{
    io.emit('eliminateLastImage', player);
  });

  // Escuchar evento de arrastre de un div
  socket.on('dragDiv', (data) => {
    // Emitir el evento a todos los demás clientes conectados
    socket.broadcast.emit('dragDiv', data);
  });

  socket.on('message', (text) => {
    io.emit('message', text);
  });

  socket.on('diceResult', (result) => {
    io.emit('showResultToAll', result);
  });

  socket.on('changeBackground', (newBackground) => {
    io.emit('backgroundChange', newBackground);
  });

  socket.on('eliminateDiv', (divId) =>{
    io.emit('eliminateDiv', divId);
  })

})

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('server did load');
