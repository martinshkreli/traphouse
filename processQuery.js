module.exports = (input, user, send, socket) => {
  
let verbs = ['say', 'freestyle', 'look', 'i', 'inv', 'attack', 'hide', 'snitch'];
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
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `${user.name} says '${message}'.`}));
  console.log(user.name, user.room.briefDescription);
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
};

if (~directions.indexOf(first)) {
  send({
    message: `You move ${first}.`
  });
  user.move(first, send);
};

if (!~verbs.indexOf(first) && !~directions.indexOf(first)) {
  send({
    message: "Didn't understand your dumb shit."
  }) 
};

}