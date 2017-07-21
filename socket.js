var io = require('socket.io');
var sanitizeHtml = require('sanitize-html');
var userCount = 0;
var names = ['Martin', 'Mark', 'Randa', 'Cyan', 'Trashy', 'Armnoodle', 'Emily', 'Speakeasy', 'Florida', 'Jinx', 'ODB']
var users = [];
var globalChatroom = [];
var auths = [];

class userProtoModel {
  constructor(name) {
    this.name = '';
  }
}

var globalMap = {
  type: 'map',
  users: []
}

exports.initialize = function(server) {
  io = io.listen(server);
  io.sockets.on("connection", function(socket) {
    socket.send(JSON.stringify(
      {
        type: 'connection',
        cookie: socket.handshake.headers.cookie
      }
    ));
    if (socket.handshake.headers == undefined) {return;}
    if (!socket.handshake.headers.cookie) {return;}
    else {
      auths[userCount] = socket.handshake.headers.cookie;
    }
    var userProto = new userProtoModel(
      names[rnd],
    );
  //put userProto information into globalMap
    globalMap.users[userCount] = userProto;
  //send a serverMessage to client
    socket.send(JSON.stringify(
      {
        type: 'serverMessage',
        message: 'Welcome to TrapHouse ' + globalMap.users[userCount].name + '! ' + userCount,
        userId: userCount
      }
    ));
    //send mapMessage to client
    socket.broadcast.send(JSON.stringify(
      {
        type: 'mapMessage',
        message: globalMap
      }
    ));
    //console.log('auth for this instance is: ' + auths[userCount]);
    userCount++;

    socket.on('message', (message) => {
      //PARSE THE MESSAGE FROM STRING BACK TO JSON
      try {
        message = JSON.parse(message);
        //this is the typical client message to the server
        if (message.type == 'userAction') {
          //ensure auth
          if (auths[((message.message.userId) - 1)] == message.message.auth
             || auths[message.message.userId] == message.message.auth
             || auths[((message.message.userId) + 1)] == message.message.auth ) {
          //  console.log("auth passed");
          }
          else {throw ("auth failed");}
          //check if user message meets obvious params
          //call stateBuilder
          var verify = stateBuilder(message); //add user update to globalMap
          //message.type = 'myMessage';
          if (verify == true) {
            io.emit('message', JSON.stringify(message));
          } else {return;}
        }

        if (message.type === 'disconnection') {
          console.log(message.message.userId + " disconnected");
        }

        if (message.type === 'textMessage') {
          const messageToSend = sanitizeHtml(message.msg);
          if (messageToSend.length < 1) {return;}
          if (messageToSend.length > 20) {return;}
          if (messageToSend.indexOf("fuck") != -1) {return;};
          if (messageToSend.indexOf("fuk") != -1) {return;};
          console.log('message recieved %s', messageToSend);
          globalChatroom.push(messageToSend);
          // Prepare to send the global chatroom to all users.
          const payload = {
            type: 'messages',
            chats: globalChatroom
          };
          // And.. Send.
          socket.send(JSON.stringify(payload));
          // And then emit to all other users too.
          socket.broadcast.send(JSON.stringify(payload));
        }
      } catch (x) {
          if (users[userCount] === 'undefined') {return}
          console.log(x);
        }
    });

    socket.on('disconnect', function(message) {
      //must update code for removing disconnected user from map
      console.log('user disconnected');
    });
  });
};


var createRandom = (min, max) => {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}
