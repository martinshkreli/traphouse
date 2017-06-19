$(function() {

var c = document.getElementById("game");
var ctx = c.getContext("2d");
var socket = io.connect('/');
var map = {
  type: 'map',
  users: []
}

var createRandom = function (min, max) {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}

var drawCircle = function(x, y, r, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.stroke();
  ctx.fill();
}

var user = {
  name: '',
  radius: 50,
  speed: 5,
  color: '',
  x: 1,
  y: 1,
  userId: 0
}

var users = [];
var auth = "";
//map.users[0] = user;

socket.on('message', function(data) {
  data = JSON.parse(data);

  if (data.username) {
    $('#messages').append('<div class="'+data.type+'"><span class="name">' + data.username + ":</span> " + data.message + '</div');
  }

  if (data.type === 'connection') {
    auth = data.cookie;
  }

  if (data.type === 'messages') {
    const allChatMessages = data.chats;
    const listElements = $('#chatroom-messages').children();
    if (listElements.length.length < 1) {
      for (var i = 0; i < allChatMessages.length; i++) {
        $("#chatroom-messages").append('<li>' + allChatMessages[i] + '</li>')
      }
    } else {
        $("#chatroom-messages").append('<li>' + allChatMessages.pop() + '</li>')
    }
  }

  if (data.type === "serverMessage") {
    $('#messages').append($('<ul>').text(data.message));
    user.userId = data.userId;
    user.color = data.color;
    user.x = data.x;
    user.y = data.y;
    user.radius = data.radius;
    map.users[user.userId] = {};
    map.users[user.userId].color = user.color;
    map.users[user.userId].radius = user.radius;
    map.users[user.userId].y = user.y;
    map.users[user.userId].x = user.x;
    drawCircle(user.x, user.y, user.radius, user.color);
  };

  if (data.type === "userAction") {
    renderUpdate(data);
  };

  if (data.type === "mapMessage") {
    for (var n = 0; n < data.message.users.length; n++){
      map.users[n] = data.message.users[n];
    }
    render();
  }
});

window.onkeydown = function(e) {
  //e.preventDefault();
  var check;
   var key = e.keyCode ? e.keyCode : e.which;
   if (key === 38 || key === 104) { //up
     if ((user.y - user.radius + 5)  < 10) {return;};
     check = collisionCheck();
      if (check == true) {
        user.y -= user.speed;
        sendPosition();
      } else {return;}
   } else if (key === 40 || key === 98) { //down
     if ((user.y + user.radius + 5) > 800) {return;};
     check = collisionCheck();
     if (check == true) {
       user.y += user.speed;
       sendPosition();
     } else {return;}
   } else if (key === 39 || key === 102) { //right
     if (user.x + user.radius + 5 > 1200) {return;};
      check = collisionCheck();
      if (check == true) {
        user.x += user.speed;
        sendPosition();
      } else {return;}
   } else if (key === 83) { //S key
       if (user.speed > 10) {
         ctx.fillStyle = 'black';ctx.font = '80px Arial';
         ctx.fillText("max speed!", 50, 200);
         return;
       } else {
         user.speed = user.speed * 1.05;
         user.radius = user.radius * 0.95;
      var data = {
        type: 'userAction',
        message: {
         userId: user.userId,
         radius: user.radius,
         color: user.color,
         x: user.x,
         y: user.y,
         auth: auth
       }
      };
      socket.send(JSON.stringify(data));
     };
   } else if (key === 37 || key === 100) { //LEFT
     if (user.x - user.radius - 5 < 0) {return;};
      check = collisionCheck();
      if (check == true) {
        user.x -= user.speed;
        sendPosition();
      } else {return;}
   } else if (key === 105) { //keypad 9
     if (user.x + user.radius + 5 > 1200) {return;};
     if ((user.y - user.radius + 5)  < 10) {return;};
     check = collisionCheck();
     if (check == true){
       user.x += user.speed;
       user.y -= user.speed;
       sendPosition();
     } else {return;}
   } else if (key === 103) { //keypad 7
     if ((user.y - user.radius + 5)  < 10) {return;};
     if (user.x - user.radius - 5 < 0) {return;};
     check = collisionCheck();
     if (check == true) {
       user.x -= user.speed;
       user.y -= user.speed;
       sendPosition();
     } else {return;}
   } else if (key === 97) { //keypad 1
     if ((user.y + user.radius + 5) > 800) {return;};
     if (user.x - user.radius - 5 < 0) {return;};
     check = collisionCheck();
      if (check == true) {
       user.x -= user.speed;
       user.y += user.speed;
       sendPosition();
      } else {return;}
   } else if (key === 99) { //keypad 3
     if (user.y + user.radius + 5 > 800) {return;};
     if (user.x + user.radius + 5 > 1200) {return;};
     check = collisionCheck();
      if (check == true) {
        user.x += user.speed;
        user.y += user.speed;
        sendPosition();
      } else {return;}
   } else if (key === 67) { //C
     user.color = "rgba(" + createRandom(0,255) + ", " + createRandom(0,255) + ", " + createRandom(0,255) + ", 0.5)";
     var data = {
       type: 'userAction',
       message: {
         userId: user.userId,
         color: user.color,
         radius: user.radius,
         x: user.x,
         y: user.y,
         auth: auth
       }
     };
      socket.send(JSON.stringify(data));
   } else if (key === 68) { //V
     console.log(map);
   }
}

var clearBackground = function() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,1200,800);
};

var render = function() {
  clearBackground();
  renderMap();
  ctx.fillStyle = 'black'; ctx.font = '18px Arial';
  ctx.fillText("Number connected: " + map.users.length, 0, 750);
};

var renderMap = function() {
};

var renderUpdate = function(data) {
    //look up current value for specific user in client-side userMap
    render();
};

  $('#send').on('click', function (clicked) {
  const messageToSend = $('#message').val();
  if (messageToSend.length < 1) {
    alert('Make sure to actually write a message!');
    return;
  }
  if (messageToSend.length > 20) {
    alert('Make sure to actually write a message!');
    return;
  }
  var payload = {
    type: 'textMessage',
    msg: messageToSend
  };
  socket.send(JSON.stringify(payload));
});

$('#setname').on('click', function(clicked) {
  socket.emit("set_name", {name: $('#nickname').val() });
});

})
