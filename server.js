const express = require('express');
const app = express();
const port = 8080;
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const server = https.createServer({
  key: fs.readFileSync('path/to/your/private-key.pem'),
  cert: fs.readFileSync('path/to/your/certificate.pem'),
}, app);

app.use(express.json());

let messages = [];

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Klien terhubung.');

  // Kirimkan semua pesan yang telah disimpan ke klien yang baru terhubung
  messages.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

  ws.on('message', (message) => {
    // Logika pengiriman dan penerimaan pesan
  });

  ws.on('close', () => {
    console.log('Klien terputus.');
  });
});

server.listen(port, () => {
  console.log(`Server berjalan di https://localhost:${port}`);
});
