const socketIo = require('socket.io');

const initialize = (server) => {

  const io = socketIo(server);
  console.log("socket.io server started!");

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.emit("welcome", {message: "Welcome to our game server!"});

    socket.on("disconnet", () => {
      console.log("user disconnected");
    })
  });
}


module.exports = initialize;
