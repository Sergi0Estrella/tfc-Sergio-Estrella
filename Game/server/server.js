const http = require('http');
const express = require('express');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Todo va bien');
});

app.get("/",(request, response)=>{
  response.sendFile("D:/tfc-sergio-estrella/Game/client/index.html");
})
