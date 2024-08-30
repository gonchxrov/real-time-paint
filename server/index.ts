import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

const PORT = process.env.PORT || 5000;
const app = express()
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const wsclients = new WeakMap<WebSocket, string>();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
app.use(express.json())

interface IMessage {
  method: string;
  id: string;
  [key: string]: any; 
}

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (msg: string) => {
    try {
      const parsedMsg: IMessage = JSON.parse(msg);
      switch (parsedMsg.method) {
        case 'connection':
          connectionHandler(ws, parsedMsg);
          break;
        case 'draw':
          broadcastConnection(parsedMsg);
          break;
        default:
          console.warn(`Unknown method: ${parsedMsg.method}`);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ error: 'Failed to process message' }));
    }
  });
});

const connectionHandler = (ws: WebSocket, msg: IMessage) => {
  wsclients.set(ws, msg.id);
  broadcastConnection(msg)
}

const broadcastConnection = (msg: IMessage) => {
  wss.clients.forEach(client => {
    const id = wsclients.get(client);
    if (id === msg.id && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

server.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`))

app.post('/image', (req: Request, res: Response) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '')
    fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')

    return res.status(200).json({sussess: true})
  } catch (e) {
    console.error(e)
    return res.status(500).json({sussess: false, error: 'internal server error'})
  }
})

app.get('/image', (req: Request, res: Response) => {
  try {
    const filePath = path.resolve(__dirname, 'files', `${req.query.id}.jpg`);
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);
      const img = `data:image/png;base64,` + file.toString('base64');
      return res.json({ success: true, img });
    } else {
      return res.json({ success: true });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: 'internal server error' });
  }
});
