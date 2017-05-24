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
UserSchema.statics.getUserById = (id, callback) => {
  User.findById(id, callback);
};

UserSchema.statics.getUserByUsername = (username, callback) => {
  let query = {username: username};
  User.findOne(query, callback);
};

UserSchema.statics.addUser = (userToAdd, callback) => {
  User.getUserByUsername(userToAdd.username, (err, user) => {
    if (err) {
      console.error(err);
      callback(err);
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
          console.error(err);
          callback(err);
          return;
        }
        bcryptjs.hash(userToAdd.password, salt, (err, hash) => {
          if (err) {
            console.error(err);
            callback(err);
            return;
          }

          userToAdd.password = hash;
          userToAdd.save((err, addedUser) => { // db save
            if (err || !addedUser) {
              console.error(err);
              callback(err);
              return;
            } else {
              addedUser.password = "!private";
              callback(null, addedUser);
              return;
            }
          });
        });
      });
    }
  });
};

UserSchema.statics.removeUser = (id, callback) => {
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    } else if (!user) {
      let error = {msg: "The user account could not be found"};
      callback(error);
      return;
    } 
    else {
      user.password = "!private";
      callback(null, user);
      return;
    }
  });
};

UserSchema.statics.authenticateUser = (username, password, callback) => {
  User.getUserByUsername(username, (err, user) => {
    if (err || !user) {
      let error = {msg: "Wrong username or password"};
      callback(error);
      return;
    }
    else {
      bcryptjs.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          callback(err);
          return;
        }
        if (result == true) {
          user.password = "!private";
          callback(null, user);
          return;
        } else {
          let error = {msg: "Wrong username or password"};
          callback(error);
          return;
        }
      });
    }
  });
};

UserSchema.statics.updateUserPassword = (id, oldPass, newPass, callback) => {
  User.getUserById(id, (err, user) => {
    if (err || !user) {
      let error = {msg: "The user could not be found"};
      callback(error);
      return;
    } else {
      bcryptjs.compare(oldPass, user.password, (err, result) => { // check the old password authenticity
        if (err) {
          console.error(err);
          callback(err);
          return;
        }

        if (result == true) { // the old pass is correct, update it!
          // hash the password
          bcryptjs.genSalt(10, (err, salt) => {
            if (err) {
              console.error(err);
              callback(err);
              return;
            }
            bcryptjs.hash(newPass, salt, (err, hash) => {
              if (err) {
                console.error(err);
                callback(err);
                return;
              }

              user.password = hash;
              user.save((err, updatedUser) => { // db save
                if (err || !updatedUser) {
                  console.error(err);
                  callback(err);
                  return;
                } else {
                  updatedUser.password = "!private";
                  callback(null, updatedUser);
                  return;
                }
              });
            });
          });
        }
        else {
          let error = {msg: "The old password does not match"};
          callback(error);
          return;
        }
      });
    }
  });
};


const User = mongoose.model("User", UserSchema);
module.exports = User;
