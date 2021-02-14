// requires for libraries
const os = require("os");

const WebSocket = require('ws');

const http = require('http');

const url = require('url'); // application constants


const port = 6380; // application initialization

const server = http.createServer();
const ws = new WebSocket.Server({
  noServer: true
}); // request router

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/comms') {
    ws.handleUpgrade(request, socket, head, function done(wsws) {
      ws.emit('connection', wsws, request);
      wsws.isAlive = true;
      console.log('Client connected ');
      wsws.on('pong', heartbeat);
      wsws.on('close', function close() {
        console.log('Client disconnected!');
        clearInterval(interval);
      });
      wsws.on('message', function incoming(message) {
        console.log('Received Message:', message);
        wsws.send(Date() + ' | Message received at ' + os.hostname + ': ' + message);
      });
    });
  } else {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }

  function heartbeat() {
    this.isAlive = true;
    console.log('Client online...');
  }

  function noop() {}

  const interval = setInterval(function ping() {
    ws.clients.forEach(function each(wsws) {
      if (wsws.isAlive === false) {
        return wsws.terminate();
      } else {
        wsws.isAlive = false;
        wsws.ping(noop);
      }
    });
  }, 30000);
});
server.listen(port);
console.log('Websocket server started on port : ' + port);
//# sourceMappingURL=app.js.map