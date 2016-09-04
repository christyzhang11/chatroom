var express = require('express');

var app = express();

app.use(express.static(__dirname));

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //post a new message
  socket.on('chat message', function(data){
    io.emit('chat message', {
  		username: data.username,
  		message: data.message,
  		time: timeutil()
  	});
  });

  //add a new user
  socket.on('add user', function(username){
  	io.emit('chat message', {
  		username: "Admin",
  		message: "Welcome " + username + " to FSE chatroome",
  		time: timeutil()
  	});
  })

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});


//a util function to format current time
function timeutil(){
  var timestr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return timestr;   
}


