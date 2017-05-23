const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// user Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: { //url
    type: String,
    trim: true
  },
  played: {
    type: Number
  },
  wins: {
    type: Number
  },
  matches: { //array with match ids
    type: [String]
  }
});

// static functions
UserSchema.statics.getById = (id, callback) => {
  User.findById(id, callback);
};

UserSchema.statics.getByUsername = (username, callback) => {
  let query = {username: username};
  User.findOne(query, callback);
};

UserSchema.statics.addUser = (userToAdd, callback) => {
  User.getByUsername(userToAdd.username, (err, user) => {
    if (err) {
      let error = {msg: "There was a problem searching for the user"};
      callback(error);
      return;
    }
    if (user) { // duplicate username
      let error = {msg: "This username is already in use"};
      callback(error);
      return;
    } else {
      // hash the password
      bcryptjs.genSalt(10, (err, salt) => {
        if (err) {
          let error = {msg: "There was an error registering the new user"};
          callback(error);
          return;
        }
        bcryptjs.hash(userToAdd.password, salt, (err, hash) => {
          if (err) {
            let error = {msg: "There was an error registering the new user"};
            callback(error);
            return;
          }

          userToAdd.password = hash;
          userToAdd.save(callback); // db save
        });
      });
    }
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
