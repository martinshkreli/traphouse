module.exports = (input, user, send, socket) => {
  
let verbs = ['say', 'freestyle', 'look', 'i', 'inv', 'attack', 'hide', 'snitch', 'spit', 'smoke'];
let directions = ['north', 'east', 'west', 'south'];

let parsed =  input.split(' ');

if (!parsed) {
  send({
    message: '>'
  });
};

let first = parsed[0];

if (first === 'say' && parsed[1]) {
  let message = parsed.splice(1, parsed.length - 1).join(' ');
  //create roomAction function
  send ({
    message: `You say, "${message}".`
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> says '${message}'.`}));
};

if (first === 'say' && parsed[1] == false) {
  send({
    message: 'Say what?!'
  });
};

if (first === 'freestyle') {
  //use roomAction
  send({
    message:  "You freestyle."
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> freestyles.`}));
};

if (first === 'smoke' && parsed[1] == false) {
  //use roomAction
  send({
    message:  "You some some weed."
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> smokes some weed.`}));
};


if (first === 'smoke' && parsed[1] === 'crack') {
  //use roomAction
  send({
    message:  "You some some crack. Got damn."
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> is smoking crack!`}));
};

if (first === 'spit') {
  //use roomAction
  send({
    message:  "You spit. Ew."
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> spits. Disgusting.`}));
};

if (first === 'hide') {
  //use roomAction
  send({
    message:  "You try to find a hiding place."
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> is trying to hide.`}));
};


if (~directions.indexOf(first)) {
  send({
    message: `You move ${first}.`
  });
  user.move(first, send);
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> moves ${first}.`}));
};

if (!~verbs.indexOf(first) && !~directions.indexOf(first)) {
  send({
    message: "Didn't understand your dumb shit."
  }) 
};

}