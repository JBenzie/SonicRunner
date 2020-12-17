var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var leaderboard = new PouchDB('leaderboard');
var user = new PouchDB('user');
const path = require('path');

io.listen(server);

app.use('/pub', express.static(path.join(__dirname, 'pub')));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// game variables
var _leaderboard = {
  _id: null,
  playerName: null
};

var _user = {
  _id: null,
  playerName: null,
  score: null
};

leaderboard.find({
  selector: {_id: {$gt: 0}},
  fields: ['_id', 'playerName'],
  sort: [{_id: 'desc'}],
  limit: 1
}).then(function (result) {
  console.log('leaderboard results: ', result);
  _leaderboard = {
    _id: result.docs[0]._id,
    playerName: result.docs[0].playerName
  }
}).catch(function (err) {
  console.log(err);
});


// UNCOMMENT TO DESTROY BOTH DATABASES
/* leaderboard.destroy().then(function (response) {
  console.log('leaderboard db destroyed successfully.');
}).catch(function (err) {
  console.log(err);
});

user.destroy().then(function (response) {
  console.log('user db destroyed successfully.');
}).catch(function (err) {
  console.log(err);
}); */



 
io.on('connection', function (socket) {
  console.log('Sweet..a user has connected!');

  leaderboard.allDocs({
    include_docs: true
  }).then(function (result) {
    console.log('LEADERBOARD DB: ', result);
  }).catch(function (err) {
    console.log(err);
  });

  socket.on('setPlayerName', function(data) {
    console.log(`Setting playerName to ${data.playerName}..`);
    _user._id = socket.id;
    _user.playerName = data.playerName;
    _user.score = 0;
    user.put(_user, function(err, res) {
      if (err) {
        return console.log(err);
      } else {
        console.log('User saved successfully!', _user);
      }
    });
  });

  socket.on('gameOver', function(scoreData) {
    console.log(`GAME OVER -- scoreData: ${scoreData.playerName} - ${scoreData.score}.`);

    leaderboard.createIndex({
        index: {
          fields: ['_id'],
          name: 'highscore',
          ddoc: 'highscoreddoc'
        }
      }).then(function (result) {
        console.log('createIndex result: ', result);
      }).catch(function (err) {
        console.log(err);
      });

      leaderboard.find({
        selector: {_id: {$gt: 0}},
        fields: ['_id', 'playerName'],
        sort: [{_id: 'desc'}],
        limit: 1
      }).then(function (result) {
        console.log('leaderboard results: ', result);
        _leaderboard = {
          _id: result.docs[0]._id,
          playerName: result.docs[0].playerName
        }
      }).catch(function (err) {
        console.log(err);
      });

    if(scoreData.score > 0 || scoreData.score > parseInt(_leaderboard._id)){
      
      leaderboard.put({
        _id: scoreData.score.toString(),
        playerName: scoreData.playerName
      }).then(function (response) {
        console.log('Leaderboard updated successfully!', response);
      }).catch(function (err) {
        console.log(err);
      });
    }

    user.get(scoreData.id).then(function(doc) {
      console.log('Deleting user..');
      return user.remove(doc);
    }).then(function (result) {
      console.log('User deleted.', result);
    }).catch(function (err) {
      console.log(err);
    });

  });
  
  socket.on('getLeaderboard', function() {
  
    leaderboard.find({
      selector: {_id: {$gt: 0}},
      fields: ['_id', 'playerName'],
      sort: [{_id: 'desc'}],
      limit: 1
    }).then(function (result) {
      console.log('leaderboard results: ', result);
      _leaderboard = {
        _id: result.docs[0]._id,
        playerName: result.docs[0].playerName
      }
    }).catch(function (err) {
      console.log(err);
    });
    console.log(_leaderboard);
    console.log(`Sending current leaderboard: ${_leaderboard.playerName} - ${_leaderboard._id}.`);
    socket.emit('leaderboardUpdate', _leaderboard);
  });

  // player disconnect
  socket.on('disconnect', function () {
    console.log('Bummer..a user has disconnected..');
  });
});


server.listen(process.env.PORT || 8081, function () {
  console.log(`I'm all ears...listening on ${server.address().port}`);
});