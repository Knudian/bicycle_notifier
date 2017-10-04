"use strict";

const http = require('http'),
    port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
   res.writeHead(200, {"Content-Type": "application/json;charset=UTF-8"});
   res.end('test');
});

const options = {
    host : '10.2.8.18',
    port : 3400,
    path : '/robberies',
    method : 'GET'
};

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
        setInterval(() =>{
            socket.emit('timer', new Date());
        }, interval);
    });
    socket.on('subscribeToRobberies', (interval) => {
        setInterval(() => {
            console.log("getting robberies");
            let body = '';
            const req = http.request(options, (res) => {
                res.on('data', (d) => { body += d});
                res.on('end', () => {
                    socket.emit('robberies', JSON.parse(body));
                });
            });
            req.end();
        }, interval);
    });
});


server.listen(port, () => {
    console.log("Server listening on", port);
});