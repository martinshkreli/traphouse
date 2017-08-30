$(function() {
  
var user = {
  name: '',
  userId: 0
}


var socket = io.connect('/');

var map = {
  type: 'map',
  users: []
}

var createRandom = function (min, max) {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}

var users = [];
var auth = "";

socket.on('message', function(data) {
  data = JSON.parse(data);
  console.log(data);
  if (data.userId) {
    user.userId = data.userId;
  };
  if (data.username) {
    $('#messages').append('<div class="'+data.type+'"><span class="name">' + data.username + ":</span> " + data.message + '</div');
  };
  if (data.type === 'connection') {
    auth = data.cookie;
  }
  if (data.type === 'messages') {
    const allChatMessages = data.chats;
    const listElements = $('#chatroom-messages').children();
    if (listElements.length.length < 1) {
      for (var i = 0; i < allChatMessages.length; i++) {
        $("#chatroom-messages").append('<p>' + allChatMessages[i] + '</p>');
        $("#chatroom-messages").scrollTop($("#chatroom-messages").prop('scrollHeight'));
      }
    } else {
        $("#chatroom-messages").append('<p>' + allChatMessages.pop() + '</p>')
        $("#chatroom-messages").scrollTop($("#chatroom-messages").prop('scrollHeight'));
    }
  }
  if(data.type === "initConnect") {
    console.log('got connection');
    $('#playerConsole').html('Player name: ' + data.name);
  };
  if(data.type === "renderMessage") {
    $('#list-messages').append(`<li>${data.message} </li>`);
    $("#chatroom-messages").scrollTop($("#chatroom-messages").prop('scrollHeight'));
  }
});

window.onkeydown = function(e) {
  //e.preventDefault();
  var check;
  var key = e.keyCode ? e.keyCode : e.which;
}

$('#send').on('click', function (clicked) {
  sendMessagePayload();
});

$('#message').keypress(function(e) {
  if (e.which == 13) {
    sendMessagePayload();
  }
})

function sendMessagePayload() {
  const messageToSend = $('#message').val();
  $('#message').val('');
  if (messageToSend.length < 1) {
    alert('Make sure to actually write a message!');
    return;
  }
  if (messageToSend.length > 55) {
    alert('Too long!');
    return;
  }
  var payload = {
    type: 'textMessage',
    msg: messageToSend,
    userId: user.userId
  };
  socket.send(JSON.stringify(payload));
}

$('#setname').on('click', function(clicked) {
  let name = $('#nickname').val();
  $('#nickname').val('');
  if (name.length < 3) return;
  if (name.length > 15) return;
  console.log(user);
  let payload = {
    type: 'nameMessage',
    name: name,
    userId: user.userId,
    auth: auth
  };
  socket.send(JSON.stringify(payload));
  });
})
