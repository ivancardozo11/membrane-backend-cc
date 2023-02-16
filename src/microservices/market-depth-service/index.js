import express from 'express';
// import socketio from 'socket.io';
import winston from 'winston';

const app = express();

// Here is the space for endpoints 

const PORT = process.env.PORT || 4000;
// const server = 
app.listen(PORT, () => {
  winston.info('Server started on port 4000 🚀🚀🚀');
});

// const io = socketio(server);

// io.on('connection', (socket) => {
//   winston.info('New client connected');

//   // Here will go socket events 

//   socket.on('disconnect', () => {
//     winston.info('Client disconnected');
//   });
// });
