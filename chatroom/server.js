var express = require('express');

var app = express();

app.use(express.static(__dirname));

var http = require('http').Server(app);

var io = require('socket.io')(http);

//db

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

//initialize
var dbexist = false;

db.serialize(function() {
	if(!dbexist) {
		db.run("CREATE TABLE MESSAGE (username TEXT, message TEXT, timestamp DATETIME)");
	}
})


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //post a new message
  socket.on('chat message', function(data){
  	var date = timeUtil();
  	var message = {
  		username: data.username,
  		message: data.message,
  		time: date
  	};
  	saveMessage(message);
    io.emit('chat message', message);
  });

  //add a new user
  socket.on('add user', function(username){
  	var date = timeUtil();
  	var message = {
  		username: "Admin",
  		message: "Welcome " + username + " to FSE chatroome",
  		time: date
  	};
  	io.emit('chat message', message);
  	//then load old messages
  	loadMessage(username);
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

//db operations

function loadMessage(username) {
	db.all("SELECT username, message, timestamp FROM MESSAGE", function(err, rows){
		// socket.broadcast.to(username).emit('chat message', {
		// 	username: username,
  // 			message: message,
  // 			time: timestamp
		// });
	console.log(rows.username, rows.message, rows.timestamp);
	});
}

function saveMessage(data) {
	db.serialize(function(){
		var stmt = db.prepare("INSERT INTO MESSAGE VALUES(" +data.username +"," + data.message +
			"," + data.time);
		console.log(stmt);
		stmt.run();
		stmt.finalize();
	});
}




