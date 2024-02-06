import express from 'express';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode';

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth()
});


const app = express();

app.get('/', (req, res) => {

  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        res.status(500).send('Erro ao gerar QR Code');
        return;
      }

      res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code</title>
        </head>
        <body>
          <img src="${url}" alt="QR Code">
        </body>
        </html>
      `);
    });
  });

  client.on('ready', () => {
    console.log('Cliente conectado!');
  });

  client.on('message_create', async (message) => {
    console.log("indexOf:", message.body.indexOf("ping"))
    if (message.body.indexOf("ping") !== -1) {
      await message.reply("pong")
    }
    console.log('Mensagem recebida:', message.body);
  });
});

app.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
  client.initialize();
  console.log('cliente criado');
});