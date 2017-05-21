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
          id: socket.id,
          inMatch: false
        };

        let existing = searchUser(user.username);
        if (existing == false) {
          users.push(user);
          io.emit("active", {active: users});
        }

        console.log("[%s] connected", user.username);
        console.log("<users>:", users);
      }
    });

    socket.on("get-active", () => {
      socket.emit("active", {active: users});
    });

    socket.on("game-request", (data) => {
      if (data.id.length > 0) {
        let opponent = searchUser(socket.username);
        if (opponent != false) {
          let emitData = {
            opponent: opponent
          };
          socket.broadcast.to(data.id).emit("game-request", emitData);

          console.log("sent game-request with", emitData, "to", data);
        }
      }
    });

    socket.on("game-response", data => {
      let emitData = {accepted: data.accepted};
      socket.broadcast.to(data.id).emit("game-response", emitData);

      console.log("sent game-response", emitData, "to", data.id);
    })

    socket.on("disconnect", () => {
      let user = searchUser(socket.username);
      if (user != false) {
        users.splice(users.indexOf(user), 1);
        io.emit("active", {active: users});
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
