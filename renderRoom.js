module.exports = (user, sender) => {
    console.log('called renderRoom');
    sender({
        message: `[${user.room.briefDescription}]`
    });
    sender({
        message: user.room.description
    });
    sender({
        message: `You also see: ${user.room.onTheFloor}`
    });
    sender({
        message: `Also here: ${user.room.usersPresent}.`
    });

};