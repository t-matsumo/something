var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ReversiLogic = require('./app/logic/ReversiLogic');
var logic = new ReversiLogic.ReversiLogic();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('start', function(){
    let firstBoardState = logic.start();
    let message = JSON.stringify({boadState: firstBoardState, currentTurn: logic.getCurrentTurn});
    socket.emit('changeBoard', message);
  });

  socket.on('selectCell', function(msg){
    let position = JSON.parse(msg);
    let boardState = logic.onSelectCell(position);
    
    let message = JSON.stringify({boadState: boardState, currentTurn: logic.getCurrentTurn});
    io.sockets.emit('changeBoard', message);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});