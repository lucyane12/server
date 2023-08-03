const express = require('express');
const app = express();
const port = 8080;
const WebSocket = require('ws');

app.use(express.json());

let messages = [];

const wss = new WebSocket.Server({ server: app.listen(port) });

wss.on('connection', (ws) => {
  console.log('Klien terhubung.');

  // Kirimkan semua pesan yang telah disimpan ke klien yang baru terhubung
  messages.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (!parsedMessage.sender || !parsedMessage.message) {
        ws.send(JSON.stringify({ error: 'Nama pengirim dan pesan harus diisi.' }));
      } else {
        const newMessage = {
          sender: parsedMessage.sender,
          message: parsedMessage.message,
          timestamp: new Date().toLocaleString(),
        };
        messages.push(newMessage);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
      }
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Format pesan tidak valid.' }));
    }
  });

  ws.on('close', () => {
    console.log('Klien terputus.');
  });
});

app.get('/',async(req,res) => {
  res.send('<h1>Server telab online</h1>');
});
