module.exports = (input, user, send, socket) => {
  
let verbs = ['say', 'freestyle', 'look', 'i', 'inv', 'attack', 'hide', 'snitch', 'spit', 'smoke', 'chill'];
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
  send ({message: `You say, "${message}".`});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({type: 'renderMessage', message: `<b>${user.name}</b> says '${message}'.`}));
  return;
};

if (first === 'say' && parsed[1] == null) {
  send({message: 'Say what?!'});
};

if (first === 'freestyle') {
  send({message: "You freestyle."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> freestyles.`}));
};

if (first === 'attack') {
  send({message: "You threaten everyone."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> is threatening to fuck everyone up.`}));
};

if (first === 'chill') {
  send({message: "You chill."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> is chillin'.`}));
};

if (first === 'smoke' && parsed[1] == null) {
  send({message: "You smoke some weed."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> smokes some weed.`}));
    return;
};

if (first === 'smoke' && parsed[1] === 'crack') {
  send({message:  "You some some crack. Got damn."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> is smoking crack!`}));
    return;
};

if (first === 'smoke' && parsed[1]) {
  send({message:  "I don't understand what you're tryna smoke."});
    return;
};

if (first === 'spit') {
  send({message:  "You spit on the ground. Ew."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> spits. Disgusting.`}));
};

if (first === 'hide') {
  send({message:  "You try to find a hiding place."});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> is trying to hide.`}));
};

if (~directions.indexOf(first)) {
  send({
    message: `You move ${first}.`
  });
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> moves ${first}.`}));
  user.move(first, send);
  
};

if (!~verbs.indexOf(first) && !~directions.indexOf(first)) {
  send({
    message: "Didn't understand your dumb shit."
  }) 
};

}