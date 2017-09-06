module.exports = (user, room) => {

    user.sendToUser({
        message: `[${room.briefDescription}]`
    });
    user.sendToUser({
        message: room.description
    });
    user.sendToUser({
        message: `You also see: ${room.onTheFloor}`
    });
    user.sendToUser({
        message: `Also here: ${room.usersPresent}.`
    });
};