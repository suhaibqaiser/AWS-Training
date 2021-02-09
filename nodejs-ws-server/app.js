const http = require('http');
var os = require("os");
const WebSocketServer = require('websocket').server;
const port = 3100;

const server = http.createServer();
server.listen(port);

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
      connection.sendUTF(Date() + ' | Message received at ' + os.hostname + ': ' + message.utf8Data);
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

console.log('Websocket server started on port : ' + port );