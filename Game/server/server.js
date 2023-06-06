const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const players = [];

const RpsGame = require('./rps-game');

const Player = require('./player');

const Game = require('./game');
const { Socket } = require('dgram');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {
  if (waitingPlayer) {
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
  }  
  
  // Enviar información de jugadores existentes al cliente recién conectado
  sock.emit('existingPlayers', players);

  // Agregar nuevo jugador
  const newPlayer = {
    id: sock.id,
    position: { x: 0, y: 0 },
  };
  players.push(newPlayer);

  // Enviar información del nuevo jugador a los jugadores existentes
  sock.broadcast.emit('newPlayer', newPlayer);

  // Manejar movimientos del jugador
  sock.on('move', (position) => {
    // Actualizar la posición del jugador en el servidor
    const player = players.find((p) => p.id === sock.id);
    if (player) {
      player.position = position;
    }

    // Enviar información de movimiento a todos los jugadores
    io.emit('playerMoved', { id: sock.id, position });
  });

  // Manejar desconexión del jugador
  sock.on('disconnect', () => {
    // Eliminar al jugador del arreglo de jugadores
    const index = players.findIndex((p) => p.id === sock.id);
    if (index !== -1) {
      players.splice(index, 1);
    }

    // Enviar información de desconexión a los jugadores existentes
    io.emit('playerDisconnected', sock.id);
  });



  sock.on('message', (text) => {
    io.emit('message', text);
  });

  sock.on('diceResult', (result) => {
    io.emit('showResultToAll', result);
  });

  sock.on('changeBackground', (newBackground) => {
    io.emit('backgroundChange', newBackground);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});

app.get("/",(request, response)=>{
  response.sendFile("D:/tfc-sergio-estrella/Game/client/index.html");
})
