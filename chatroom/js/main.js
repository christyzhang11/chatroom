$(function(){
    var socket = io();
    //var connected = false;

    $(".form").submit(function(){
        post();
        return false;
    });

    $("#submit").click(function(){
        getUserName();
        return false;
    });

    socket.on('chatMessageSuccess', function(message) {
      newMessage(message);
    });

    socket.on('userLeft', function(data) {
        var msg = $('<span class="left">').text(data.username + " left the chat room.");
        $("#messages").append($('<li>')).append(msg);
    });

    function getUserName() {
        socket.username = $("#username").val().trim();
        if(socket.username) {
            $("#login").fadeOut();
            $("#chatroom").show();

          //emit add user name action
          socket.emit('addUser', socket.username);
          socket.on('addUserSuccess', function(data) {
              for(var i = 0; i < data.length; i++) {
                newMessage(data[i]);
              }
          });

          //notify all user 
          socket.on('welcome', function(msg){
            newMessage(msg);
          });
        }else{
            alert("invalid username");
        }
    }

    function post() {
        var msg = $('#m').val().trim();
        //emit post message action
        socket.emit('chatMessage', {
            username : socket.username,
            message: msg,
            time: new Date()
        });

        //reset the input
        $('#m').val('');
    }

    function newMessage(data){
        formNewMessage(data);
    }

    function formNewMessage(data){
        var user = $('<span class="postuser" />').text(data.username);
        var time = $('<span class="posttime" />').text(data.timestamp);
        var msg = $('<span class="msgbody"/>').text(data.message);
        $("#messages").append($('<li>')).append(user, msg, time);
    }
});