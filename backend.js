const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const uri = 'mongodb://mongo:AGhLs3Q4PxBgUwoKpZIY@containers-us-west-21.railway.app:5452';
const client = new MongoClient(uri);

client.connect((error) => {
  if (error) {
    console.error('Error trying to connect to the database:', error);
  } else {
    console.log('Successful connection to the database');
  }
});

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const RpsGame = require('./rps-game');

const port = 3000

app.use(express.static('public'))

app.get('/index', (req, res) => {
  res.redirect("https://tfc-dice-dungeons-production.up.railway.app/index.html");
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

app.get("/tienda", (req, res)=>{
  res.sendFile("C:/Users/seestrella/Desktop/tfc-Sergio-Estrella/public/catalogo.html")
})

app.get("/juego", (req,res)=>{
  res.sendFile("C:/Users/seestrella/Desktop/tfc-Sergio-Estrella/public/juego.html")
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Configurar body-parser para analizar los datos de las solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Manejar la solicitud de inicio de sesión
app.post('/login', (req, res) => {
  const email = req.body.loginemail;
  const password = req.body.loginPassword;

  // Realizar la lógica de autenticación y recuperar los datos del usuario desde la base de datos
  // Aquí puedes utilizar el cliente de MongoDB u otra forma de acceder a los datos del usuario

  // Ejemplo de verificación de inicio de sesión básica
  if (email === 'usuario@example.com' && password === 'contraseña') {
    // Inicio de sesión exitoso
    res.send('Inicio de sesión exitoso');
  } else {
    // Credenciales inválidas
    res.status(401).send('Credenciales inválidas');
  }
});

// Ejemplo de añadir un documento a una colección
app.post('/usuarios', async (req, res) => {
  try {
    const collection = client.db().collection('usuarios');

    // Obtener los datos del usuario desde el cuerpo de la solicitud
    const nuevoUsuario = req.body;

    // Insertar el nuevo usuario en la colección
    const resultado = await collection.insertOne(nuevoUsuario);

    res.json(resultado);
  } catch (error) {
    console.error('Error al insertar el documento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Aquí puedes utilizar el cliente de MongoDB para realizar la consulta a la base de datos
    const collection = client.db().collection('usuarios');
    const usuario = await collection.findOne({ _id: userId });

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al recuperar los datos del usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

console.log('server did load');
