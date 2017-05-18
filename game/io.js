const socketIo = require('socket.io');

const users = [];

const initialize = (server) => {

  const io = socketIo(server);
  console.log("socket.io server started!");

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.emit("welcome", {message: "Welcome to our game server!"});

    socket.on("username", (data) => {
      if (data.username.length > 0) {
        socket.username = data.username;
        let user = {
          username: data.username,
          id: socket.id
        };

        let existing = searchUser(user.username);
        if (existing == false) {
          users.push(user);
        }

        console.log("[%s] connected", user.username);
        console.log("<users>:", users);
      }
    });

    socket.on("disconnect", () => {
      let user = searchUser(socket.username);
      if (user != false) {
        users.splice(users.indexOf(user), 1);
      }

      console.log("[%s] disconnected", socket.username);
      console.log("<users>:", users);
    });
  });
}

const searchUser = (username) => {
  for (user of users) {
    if (user.username == username) {
      return user;
    }
  }

  return false;
};


module.exports = initialize;
