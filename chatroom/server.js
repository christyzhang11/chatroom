var express = require('express');

var app = express();

app.use(express.static(__dirname));

var http = require('http').Server(app);

var io = require('socket.io')(http);

//db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //post a new message
  socket.on('chatMessage', function(data){
    saveMessage(data);
    data.timestamp = timeUtil();
    io.emit('chatMessageSuccess', data);
  });

  //add a new user
  socket.on('addUser', function(username){
    socket.username = username;
    // load previous messages
    db.all("SELECT username, message, timestamp FROM MESSAGE", function(err, rows){
      if(err === null) {
        socket.emit('addUserSuccess', rows); //just notify the joined user
      }else {
        // return customed error message
      }
    });
     var welcomeMessage = {
      username: "Admin",
      message: "Welcome " + username + " to FSE chatroom",
      timestamp: timeUtil()
    };

    io.emit("welcome", welcomeMessage);
  });

  //user left
  socket.on('disconnect', function(){
    io.emit('userLeft', {
      username : socket.username
    });
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//a util function to format current time
function timeUtil(){
  var timestr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return timestr;
}

function saveMessage(data) {
  db.serialize(function(){
    var stmt = db.prepare("INSERT INTO MESSAGE(username, message) VALUES('" +data.username +"','" + data.message + "')");
    stmt.run();
    stmt.finalize();
  });
}

