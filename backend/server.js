const express = require('express');
const routing = require('./routing/routes')
const { connectDataBase } = require('./database/database')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const cors = require('cors');

const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

connectDataBase();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

app.use('/', routing);

server.listen(3001, () => {
    console.log("server is running  on port 3001");
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('join', (phoneNumber) => {
        onlineUsers.set(phoneNumber, socket.id);
        socket.emit('online', Array.from(onlineUsers.keys()));
    });
    
    socket.on('sendMessage', (data) => {
        const receiver = onlineUsers.get(data.to);
        const sender = onlineUsers.get(data.sender);
        socket.to(sender).emit('getMessage', data);
        socket.to(receiver).emit('getMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
        for (const [phoneNumber, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
              onlineUsers.delete(phoneNumber);
              socket.emit('online', Array.from(onlineUsers.keys()));
              break;
            }
        }
    });
});
