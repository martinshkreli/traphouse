var createRandom = (min, max) => {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}

var io = require('socket.io');
var sanitizeHtml = require('sanitize-html');
var userCount = 0;
var prefix = ['Lil', 'Big', 'Fat', 'OG', 'Blood', 'El', 'Don', 'Boss', 'Killer', 'Babyface' ]
var suffix = ['da OG', 'The Ruler', 'The Best', 'Stacks']
var names = ['Mills', 'Bones', 'T', 'Tone', 'Tony', 'Daquan', 'Deadeye', 'ODB', 'Virus', 'Guerro', 'Speakeasy', 'Florida', 'Jinx', 'ODB', 'Nasty', 'Slim', 'Maurice', 'EZ Gunz', 'Yung Trap Lord', 'Big Mo', 'Tyrone', 'Slam', 'T-Bone', 'Daddy', 'Daquan', 'Pablo', 'Jimmy Two Times', 'Johnny Bagels', 'Quan', 'Shorty', 'RaRa', 'TayTay'];
var users = [];
var globalChatroom = [];
var auths = [];

class User {
  constructor(name) {
    const prefixPart = prefix[createRandom(0, prefix.length - 1)];
    const namePart = names[createRandom(0, names.length - 1)];
    const suffixPart = suffix[createRandom(0, suffix.length -1)];
    this.name = `${prefixPart} ${namePart} ${suffixPart}`;
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
    
    let user = new User();

    globalMap.users[userCount] = user;
    
  //send a serverMessage to client
    socket.send(JSON.stringify(
      {
        type: 'initConnect',
        name: globalMap.users[userCount].name,
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
             || auths[((message.message.userId) + 1)] == message.message.auth ) {}
          else {throw ("auth failed");}
          if (verify == true) {
            io.emit('message', JSON.stringify(message));
          } else {return;}
        }

        if (message.type === 'disconnection') {
          console.log(message.message.userId + " disconnected");
        }
        if (message.type === 'nameMessage') {

          if (auths[((message.message.userId) - 1)] == message.message.auth
             || auths[message.message.userId] == message.message.auth
             || auths[((message.message.userId) + 1)] == message.message.auth ) {}
          else {throw ("auth failed");}

          console.log('name setting attempted!');
          console.log(message);
          globalMap.users[message.userId].name = message.name;
          let payload = {
            type: 'initConnect',
            name: globalMap.users[message.userId].name,
            userCount: message.userId
          };
          socket.send(JSON.stringify(payload));
        }
        if (message.type === 'textMessage') {
          let messageToSend = sanitizeHtml(message.msg);
          messageToSend = globalMap.users[message.userId].name + ': ' + messageToSend;
          if (messageToSend.length < 1) {return;}
          if (messageToSend.length > 40) {return;}
          if (messageToSend.indexOf("fuck") != -1) {return;};
          if (messageToSend.indexOf("fuk") != -1) {return;};
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


