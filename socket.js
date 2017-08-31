let processQuery = require('./processQuery');
let renderRoom = require('./renderRoom');

var createRandom = (min, max) => {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
};

let serverSender = socket => message => {
  socket.send(JSON.stringify(Object.assign({
    type: 'renderMessage'
  }, message)));
};

var io = require('socket.io');
var sanitizeHtml = require('sanitize-html');
var userCount = 0;
var prefix = ['Lil', 'Big', 'Fat', 'OG', 'Blood', 'El', 'Don', 'Boss', 'Killer', 'Babyface', 'Yung', 'EZ', 'Easy', 'Big Homie', 'Mister', 'Slim', 'Killa', 'Soulja'];
var suffix = ['da OG', 'The Ruler', 'The Best', 'Stacks', 'the Thug', 'the GOAT', 'Money', '$$$', 'tha Don', 'Gotti', 'da Connect', 'Tellem', 'da Plug'];
var names = ['Mills', 'Bones', 'T', 'Tone', 'Tony', 'Daquan', 'Goose', 'Deadeye', 'ODB', 'Virus', 'Guerro', 'Speakeasy', 'Florida', 'Jinx', 'ODB', 'Nasty', 'Slim', 'Maurice', 'Gunz', 'Trap Lord', 'Mo', 'Tyrone', 'Slam', 'T-Bone', 'Daddy', 'Daquan', 'Pablo', 'Jimmy Two Times', 'Johnny Bagels', 'Quan', 'Shorty', 'RaRa', 'TayTay', 'Uzi', 'Chunga', '2na', 'Quills', 'Rodney'];
var users = [];
var auths = [];

class User {
  constructor(renderRoom) {
    const prefixPart = prefix[createRandom(0, prefix.length - 1)];
    const namePart = names[createRandom(0, names.length - 1)];
    const suffixPart = suffix[createRandom(0, suffix.length -1)];
    this.name = `${prefixPart} ${namePart} ${suffixPart}`;
    this.room = globalMap.rooms.upperRight;
    this.renderRoom = renderRoom;
  }
  move(direction, sender) {
    let directionObj = this.room.exits[direction];
    this.room = globalMap.rooms[directionObj];
    this.renderRoom(this, sender);
    this.room.usersPresent.push(this.name);
  }
};

var globalMap = {
  type: 'map',
  users: [],
  rooms: {
    upperRight: {
      exits: {
        west: 'upperLeft',
        south: 'lowerRight'
      },
      briefDescription: 'East 43rd Street',
      description: 'You\'ve arrived where all young gangsters start, the upper right part of the hood.<br>Obvious exits: south, west.',
      usersPresent: ['Fred the Junkie'],
      onTheFloor: ['weed'],
    },
    upperLeft: {
      exits: {
        east: 'upperRight',
        south: 'lowerLeft'
      },
      briefDescription: 'West 43rd Street',
      description: 'You\'re in the upper left part of the hood. Obvious exits: east and south.',
      usersPresent: [],
      onTheFloor: ['glock'],
    }
  }
};

exports.initialize = function(server) {
  io = io.listen(server);
  io.sockets.on("connection", function(socket) {

    let sender = serverSender(socket);

    sender({
      type: 'connection',
      cookie: socket.handshake.headers.cookie
    });

    if (socket.handshake.headers == undefined) {return;}
    if (!socket.handshake.headers.cookie) {return;}
    else {
      auths[userCount] = socket.handshake.headers.cookie;
    };
    
    let user = new User(renderRoom);
    globalMap.users[userCount] = user;

    sender({message: `Connected to TrapHouse. Welcome <b>${user.name}.</b>`});
      user.room.usersPresent.push(user.name);
      socket.join(user.room.briefDescription);
      socket.broadcast.to(user.room.briefDescription).emit('message', 
      JSON.stringify({
        type: 'renderMessage', 
        message: `<b>${user.name}</b> has arrived.`}
      ));
      

    renderRoom(user, sender);

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

        if (message.type === 'disconnection') {console.log(message.message.userId + " disconnected");}
        if (message.type === 'textMessage') {
          let cleanMessage = sanitizeHtml(message.msg, {allowedTags: []});
          sender({message: `> ${cleanMessage}`});
        };

        let newMessage = sanitizeHtml(message.msg, {allowedTags: []});

        processQuery(newMessage, user, sender, socket);

      } catch (x) {
          if (users[userCount] === 'undefined') {return}
        }
    });

    socket.on('disconnect', function(message) {
      //must update code for removing disconnected user from map
      console.log('user disconnected');
    });
  });
};


