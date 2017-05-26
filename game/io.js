const socketIo = require('socket.io');
const Match = require('../models/match');
const User = require('../models/user');

// arrays to store the dynamic data
const users = [];
const matches = [];
const sockets = [];

// starting point - takes an http server
const initialize = (server) => {
  const io = socketIo(server); // create the socketIo namespace (we just use the default one)
  console.log("socket.io server started!");

  // handles the "connection" event (first to happen when a client connects)
  io.on("connection", (socket) => {
    sockets.push(socket); // store the socket
    socket.emit("welcome", {message: "Welcome to our game server!"});


    // "username" event - we need the username to easily mark our <user> and <socket> objects
    socket.on("username", (data) => {
      if (data.username.length > 0) {
        socket.username = data.username;

        let user = {
          username: data.username,
          id: socket.id,
          inMatch: false
        };

        let existing = searchUser(user.username); // TODO remove, because we check the username duplicate on authentication
        if (existing == false) {
          users.push(user); // store the user object
          io.emit("active", {active: users}); // send the active list to all clients
        }

        console.log("[%s] connected", user.username);
        console.log("<users>:", users);
        console.log("<matches>:", matches);
      }
    });


    // "get-active" event - send the lists on demand
    socket.on("get-active", () => {
      socket.emit("active", {active: users});
      socket.emit("active-matches", {matches: matches});
    });


    // "game-request" event - send the request to the challanged user
    socket.on("game-request", (data) => {
      if (data.id.length > 0) {
        let opponent = searchUser(socket.username);
        if (opponent != false) {
          let emitData = {opponent: opponent};
          socket.broadcast.to(data.id).emit("game-request", emitData);

          console.log("sent game-request with", emitData, "to", data);
        }
      }
    });


    // "game-response" event - sends the response to the challanger
    // if accepted, creates the <match> object and the new room for sockets communiction
    socket.on("game-response", data => {
      let emitData = {accepted: data.accepted};
      if (data.accepted == true) {
        let roomName = generateRoom();
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
        socket.matchRoom = match.room;
      }

      socket.broadcast.to(data.opponent.id).emit("game-response", emitData);
      console.log("sent game-response", emitData, "to", data.opponent.username);
    });


    // "join" event - socket joins the match room, <match> object is broadcasted to the room
    socket.on("join", (data) => {
      if (data.room.length > 0) {
        socket.join(data.room, () => {
          let match = searchMatch(data.room);
          if (match != false) {
            let emitData = {match: match};
            io.to(data.room).emit("match", emitData);
            socket.matchRoom = match.room;

            changeInMatchStatus(match.player1.username, match.player2.username);
            io.emit("active", {active: users});
            io.emit("active-matches", {matches: matches});

            console.log("<matches>:", matches);
            console.log("<users>:", users);
          }
        });
      }
    });


    // "choice" event - user places his choice
    // if both users chosen, check the winner and send the "round" event with data
    socket.on("choice", (data) => {
      console.log("choice:", data);
      let match = searchMatch(data.room);
      if (match != false) {
        if (match.player1.username == data.username) {
          match.player1.choice = data.choice;
        } else if (match.player2.username == data.username) {
          match.player2.choice = data.choice;
        }

        if (match.player1.choice.length > 0 && match.player2.choice.length > 0) { // both users chosen
          let winner = checkWinner(match.player1.choice, match.player2.choice);
          let winnerName = 0;
          let matchWinner = "";

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
          if (match.player1.score == 2) {
            ended = true;
            matchWinner = match.player1.username;
          } else if (match.player2.score == 2) {
            ended = true;
            matchWinner = match.player2.username;
          }

          let emitData = {
            room: data.room,
            choice1: match.player1.choice,
            choice2: match.player2.choice,
            winner: winnerName,
            ended: ended
          };

          io.to(data.room).emit("round", emitData);

          match.player1.choice = "";
          match.player2.choice = "";

          io.emit("active-matches", {matches: matches});
          console.log("round end:", emitData);

          if (ended == true) { // the match ended
            // save the match in db
            let dbMatch = new Match({
              winner: matchWinner,
              player1: {
                username: match.player1.username,
                score: match.player1.score
              },
              player2: {
                username: match.player2.username,
                score: match.player2.score
              }
            });

            Match.addMatch(dbMatch, (err, addedMatch) => {
              if (err || !addedMatch) {
                console.error(err);
              } else { // the match was saved succesfully
                console.log("added match to db:", addedMatch);
                // update the users match data
                User.addMatchData(addedMatch.player1.username, addedMatch._id, addedMatch.winner, (err, updatedUser) => {
                  if (err || !updatedUser) {
                    console.error("user match data could not be updated:", addedMatch.player1.username);
                  } else {
                    console.log("user match data updated:", addedMatch.player1.username);
                  }
                });

                User.addMatchData(addedMatch.player2.username, addedMatch._id, addedMatch.winner, (err, updatedUser) => {
                  if (err || !updatedUser) {
                    console.error("user match data could not be updated:", addedMatch.player2.username);
                  } else {
                    console.log("user match data updated:", addedMatch.player2.username);
                  }
                });
              }
            });

            endMatch(match);
            io.emit("active", {active: users});
            io.emit("active-matches", {matches: matches});

            console.log("<matches>:", matches);
            console.log("<users>:", users);
          }
        }
      }
    });


    // "disconnect" event - removes the socket data, and match if there is
    socket.on("disconnect", () => {
      let user = searchUser(socket.username);
      if (user != false) {
        users.splice(users.indexOf(user), 1);

        let match = searchMatch(socket.matchRoom);
        if (match != false) {
          let emitData = {left: socket.username};
          socket.to(socket.matchRoom).emit("leave-match", emitData); // opponent disconnected
          endMatch(match);
        }

        sockets.splice(sockets.indexOf(socket), 1);
      }

      io.emit("active", {active: users});
      io.emit("active-matches", {matches: matches});

      console.log("[%s] disconnected", socket.username);
      console.log("<users>:", users);
      console.log("<matches>:", matches);
    });
  });
}


// helper functions

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
       return 2; // player2

  } else if(choice1 == choice2){
      return 0; // draw
  }

  return 1; // player1
}


// removes the match and clear its room
const endMatch = (match) => {
  let matchIndex = matches.indexOf(match);
  if (matchIndex > -1) {
    matches.splice(matchIndex, 1);
    changeInMatchStatus(match.player1.username, match.player2.username);
    console.log("match end:", match);

    for (socket of sockets) {
      if (socket.matchRoom == match.room) {
        socket.leave(match.room);
        socket.matchRoom = "";
      }
    }
  }
}


module.exports = initialize;
