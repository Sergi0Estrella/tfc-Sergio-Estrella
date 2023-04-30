const http = require('http');
const express = require('express');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

server.on('error', (err) => {
    console.error("Error del servidor: " , err);
})

const puerto = 8080;

server.listen(puerto, () =>{
    console.log(`Servidor iniciado en el puerto ${puerto}`);
})