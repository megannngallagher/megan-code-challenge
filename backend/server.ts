import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

import CONFIG from './config';

const app = express();
const router = express.Router();

const httpServer = http.createServer(http);
const io = new IOServer(httpServer);

app.use(router);
app.use(cors({ origin: '*' }));

const activeUsers: Set<string> = new Set();  
const connectedUsers: Set<string> = new Set();  
let usersJoiningChat: { [key: string]: string } = {};

io.on('connection', (socket) => {
  console.log('A user is connected successfully ', socket.id);

  socket.on('connectUser', (connectionId: string) => {
    console.log("user is connected with connection id: ", connectionId, socket.id)

    if(connectedUsers.size === 0){
      console.log("only connected user, no messages sent or received")
    }
    connectedUsers.add(connectionId)
  })

  socket.on('joinChat', (chatId: string, connectionId: string) => {
    console.log(`${connectionId} joined chat ${chatId}`);

    if(activeUsers.size === 0){
      console.log("only person in chat, no messages will be recieved or sent", activeUsers)
    }

    activeUsers.add(connectionId)
    console.log("users in chat", activeUsers)

    usersJoiningChat[connectionId] = socket.id; 
    usersJoiningChat[chatId] = chatId;
  });

  socket.on('sendMessageOver', (data: { senderId: string; receiverId: string; message: string; chatId: string}) => {
    const { senderId, receiverId, message, chatId } = data;

    const receiverSocketId = usersJoiningChat[receiverId];

    if(receiverId && chatId) {
      io.to(senderId).emit('already in chat.')
    }
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incoming_message', { senderId, message });
    }
  });

  socket.on('disconnect', () => {
    for (const userId in usersJoiningChat) {{
        delete usersJoiningChat[userId]; 
        break;
      }
    }
    console.log('disconnected');
  });
});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
