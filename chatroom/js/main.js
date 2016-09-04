$(function(){
    var socket = io();
    var username; //keep a global username
    //var connected = false;

    //type enter to submit
    $("input").keydown(function(event) {
        if (event.which == 13 ) {
        	if(username){
            	$("#post").click();
        	}else{
        		$("#submit").click();
       	 	}
       	}
    });

    $(".form").submit(function(){
    	post();
    	return false;
    });

    $("#submit").click(function(){
    	getUserName();
    	return false;
    });

    socket.on('chat message', function(msg){
        newMessage(msg)
    });

    function getUserName() {
    	username = $("#username").val().trim();
    	if(username) {
    		$("#login").fadeOut();
    		$("#chatroom").show();
    		//emit add user name action
    		socket.emit('add user', username);
    	}else{
    		alert("invalid username");
    	}
    }

    function post() {
    	var msg = $('#m').val().trim();
    	//emit post message action
    	socket.emit('chat message', {
    		username : username,
    		message: msg 
    	});
    	//reset the input
    	$('#m').val('');
    }

    function newMessage(data){
    	formNewMessage(data);
    }

    function formNewMessage(data){
    	var user = $('<span class="postuser" />').text(data.username);
    	var time = $('<span class="posttine" />').text(data.time);
    	var msg = $('<span class="msgbody"/>').text(data.message);
    	$("#messages").append($('<li>')).append(user, msg, time);
    }
});