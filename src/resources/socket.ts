import socketIO, { Socket, Server as SocketServer } from 'socket.io';

import express from 'express';
import cors from 'cors';
import { IncomingMessage, Server, ServerResponse } from 'http';

const app = express();

app.use(cors({ credentials: true }));

export const serverSocket = (
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketServer(httpServer, {
    cors: { credentials: true },
  });

  io.on('connection', connectHanelder);
};

function connectHanelder(socket: Socket) {
  socket.on('joinRoom', (data) => {
    socket.join(data);
  });
}
