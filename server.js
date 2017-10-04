"use strict";

const http = require('http'),
    port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
   res.writeHead(200, {"Content-Type": "application/json;charset=UTF-8"});
   res.end('test');
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
       console.log('Client subscribing with a ', interval, 'interval');
       setInterval(() => {
           socket.emit('timer', new Date());
       }, interval);
    });
    socket.on('message', (message) => {
        console.log(message);
    });
});

server.listen(port, () => {
    console.log("Server listening on", port);
});