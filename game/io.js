const socketIo = require('socket.io');

const users = [];
const matches = [];

const initialize = (server) => {

  const io = socketIo(server);
  console.log("socket.io server started!");

  io.on("connection", (socket) => {
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
      socket.emit("active-matches", {matches: matches});
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

      if (data.accepted == true) {
        let roomName = generateRoom();
        console.log("new room:", roomName);
        emitData.room = roomName;

        let match = {
          room: roomName,
          player1: {
            username: socket.username,
            score: 0,
            choice: ""
          },
          player2: {
            username: data.opponent.username,
            score: 0,
            choice: ""
          }
        };

        console.log("new match:", match);
        console.log("<matches>:", matches);

        matches.push(match);
        socket.join(roomName);
      }

      socket.broadcast.to(data.opponent.id).emit("game-response", emitData);
      console.log("sent game-response", emitData, "to", data.opponent.username);
    });

    socket.on("join", (data) => {
      if (data.room.length > 0) {
        socket.join(data.room, () => {
          let match = searchMatch(data.room);
          if (match != false) {
            let emitData = {
              match: match
            };

            io.to(data.room).emit("match", emitData);
            console.log("sent match:", emitData, "to", data.room);

            // TODO: send active matches
            changeInMatchStatus(match.player1.username, match.player2.username);
            console.log("<matches>:", matches);
            console.log("<users>:", users);
            io.emit("active", {active: users});
            io.emit("active-matches", {matches: matches});
          }
        });
      }
    });

    socket.on("choice", (data) => {
      console.log("choice:", data);
      let match = searchMatch(data.room);
      if (match != false) {

        if (match.player1.username == data.username) {
          match.player1.choice = data.choice;
        } else if (match.player2.username == data.username) {
          match.player2.choice = data.choice;
        }

        if (match.player1.choice.length > 0 && match.player2.choice.length > 0) {
          let winner = checkWinner(match.player1.choice, match.player2.choice);
          let winnerName = 0;

          if (winner != 0) {
            switch (winner) {
              case 1: {
                match.player1.score++;
                winnerName = match.player1.username;
                break;
              }

              case 2: {
                match.player2.score++;
                winnerName = match.player2.username;
                break;
              }
            }
          }

          let ended = false;
          if (match.player1.score == 2 || match.player2.score == 2) {
            ended = true;
          }

          let emitData = {
            room: data.room,
            choice1: match.player1.choice,
            choice2: match.player2.choice,
            winner: winnerName,
            ended: ended
          };

          io.to(data.room).emit("round", emitData);
          console.log("round end:", emitData);

          if (ended == true) {
            endMatch();
            console.log("match ended:", match);
            console.log("<matches>:", matches);
            console.log("<users>:", users);
            io.emit("active", {active: users});
            io.emit("active-matches", {matches: matches});
          }
        }
      }
    });

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

const searchMatch = (room) => {
  for (match of matches) {
    if (match.room == room) {
      return match;
    }
  }

  return false;
};

const changeInMatchStatus = (player1, player2) => {
  let user1 = searchUser(player1);
  user1.inMatch = !user1.inMatch;

  let user2 = searchUser(player2);
  user2.inMatch = !user2.inMatch;

}

let roomNum = 0;
const generateRoom = () => {
  let room = "room";
  room += roomNum;
  roomNum++;

  return room;
}

const checkWinner = (choice1, choice2) => {
  if ((choice1 == 'rock' && choice2 == 'paper') ||
     (choice1 == 'paper' && choice2 == 'scissors') ||
     (choice1 == 'scissors' && choice2 == 'rock')) {
       return 2;

  } else if(choice1 == choice2){
      return 0;
  }

  return 1;
}


module.exports = initialize;
