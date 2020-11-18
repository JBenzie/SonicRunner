var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

io.listen(server);

app.use('/pub', express.static(path.join(__dirname, 'pub')));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {
  console.log('Sweet..a user has connected!');

  // player disconnect
  socket.on('disconnect', function () {
    console.log('Bummer..a user has disconnected..');
  });
});


server.listen(process.env.PORT || 8081, function () {
  console.log(`I'm all ears...listening on ${server.address().port}`);
});