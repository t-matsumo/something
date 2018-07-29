var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Rooms = require('./app/Room/Rooms').Rooms;
var rooms = new Rooms();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('start', function (id, playerColor) {
    rooms.register(id, playerColor);

    let timer = setInterval(function () {
      if (rooms.matched(id)) {
        clearInterval(timer);

        let room = rooms.info(id);
        socket.join(room.roomId);

        let firstBoardState = room.logic.start();
        let message = JSON.stringify({ boadState: firstBoardState, currentTurn: room.logic.currentTurn, winner: room.logic.winner, roomId: room.roomId, numOfBlack: room.logic.numOfBlack, numOfWhite: room.logic.numOfWhite });
        io.to(id).emit('start', message);
      }
    }, 5000);
  });

  socket.on('selectCell', function (id, msg) {
    let room = rooms.info(id);

    let position = JSON.parse(msg);
    let boardState = room.logic.onSelectCell(position);

    let message = JSON.stringify({ boadState: boardState, currentTurn: room.logic.currentTurn, winner: room.logic.winner, roomId: room.roomId, numOfBlack: room.logic.numOfBlack, numOfWhite: room.logic.numOfWhite });
    io.to(room.roomId).emit('changeBoard', message);
  });

  socket.on('end', function (id) {
    let room = rooms.info(id);
    socket.leave(room.roomId);
    rooms.unregist(id);
  });
});

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000');
});