module.exports = (input, user, send, socket) => {
  
let verbs = ['say', 'freestyle', 'look', 'i', 'inv', 'attack', 'hide', 'snitch', 'spit', 'smoke', 'chill'];
let directions = ['north', 'east', 'west', 'south'];

let parsed =  input.split(' ');

if (!parsed) {
  user.sendToUser({
    message: '>'
  });
};

let first = parsed[0];

if (first === 'say' && parsed[1]) {
  let message = parsed.splice(1, parsed.length - 1).join(' ');
  user.sendToUser({message: `You say, "${message}".`});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> says '${message}'.`);
  return;
};

if (first === 'say' && parsed[1] == null) {
  user.sendToUser({message: 'Say what?!'});
};

if (first === 'freestyle') {
  user.sendToUser({message: "You freestyle."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> freestyles.`);
};

if (first === 'attack') {
  user.sendToUser({message: "You threaten everyone."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> is threatening to fuck everyone up.`);
};

if (first === 'chill') {
  user.sendToUser({message: "You chill."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> is chillin'.`);
};

if (first === 'smoke' && parsed[1] == null) {
  user.sendToUser({message: "You smoke some weed."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> smokes some weed.`);
    return;
};

if (first === 'smoke' && parsed[1] === 'crack') {
  user.sendToUser({message:  "You some some crack. Got damn."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> is smoking crack!`);
    return;
};

if (first === 'smoke' && parsed[1]) {
  user.sendToUser({message:  "I don't understand what you're tryna smoke."});
    return;
};

if (first === 'spit') {
  user.sendToUser({message:  "You spit on the ground. Ew."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> spits. Disgusting.`);
};

if (first === 'hide') {
  user.sendToUser({message:  "You try to find a hiding place."});
  user.broadcastSocketChannel(user.room, `<b>${user.name}</b> is trying to hide.`);
};

if (~directions.indexOf(first)) {
  /*
  send({message: `You move ${first}.`});
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> moves ${first}.`}));
  user.move(first, send);  
  socket.broadcast.to(user.room.briefDescription).emit('message', JSON.stringify({
    type: 'renderMessage', message: `<b>${user.name}</b> has arrived.`}));
  */

  
};

if (!~verbs.indexOf(first) && !~directions.indexOf(first)) {
  user.sendToUser({
    message: "Didn't understand your dumb shit."
  }) 
};
}