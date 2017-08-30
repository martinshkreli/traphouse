module.exports = (input, user, send) => {
  
let verbs = ['say', 'freestyle', 'look', 'i', 'inv', 'attack', 'hide', 'snitch'];
let directions = ['north', 'east', 'west', 'south'];

let parsed =  input.split(' ');

console.log(parsed);

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

};

if (first === 'say') {
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