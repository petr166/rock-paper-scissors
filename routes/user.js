const express = require('express');
const router = express.Router();
const User = require('../models/user');
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');


// POST "/register"
router.post("/register", (req, res, next) => {
  let body = req.body;
  let response = {success: false};

  let newUser = new User({
    name: body.name,
    username: body.username,
    email: body.email,
    password: body.password,
    avatar: "https://api.adorable.io/avatars/140/" + body.username + "@adorable.png",
    played: 0,
    wins: 0,
    matches: []
  });

  User.addUser(newUser, (err, addedUser) => {
    if (err) {
      response.msg = err.msg || "There was an error registering the new user";
      res.json(response);
    } else {
      console.log("[%s] registered successfuly", addedUser.username);

      response.success = true;
      response.msg = "User registered successfuly";
      response.user = addedUser;

      res.json(response);
    }
  });
});


// POST "/login"
router.post("/login", (req, res, next) => {
  let body = req.body;
  let response = {success: false};

  User.authenticateUser(body.username.trim(), body.password.trim(), (err, user) => {
    if (err || !user) {
      response.msg = err.msg || "There was an error authenticating the user";
      res.json(response);
    } else { // generate the unique token to be sent to the user
      let token = jwt.sign(user, config.secret, {expiresIn: 604800});

      response.token = "JWT " + token;
      response.user = user;
      response.msg = "User authenticated successfuly";
      response.success = true;

      console.log("[%s] authenticated successfuly", user.username);
      res.json(response);
    }
  });
});


// GET "/profile/:id"
router.get("/profile/:id", (req, res, next) => {
  let theId = req.params.id;
  let response = {success: false};

  User.getUserById(theId, (err, user) => {
    if (err || !user) {
      response.msg = "The user could not be found";
      res.json(response);
    } else {
      response.success = true;
      response.msg = "User profile retrieved successfuly";
      user.password = "!private";
      response.user = user;

      res.json(response);
    }
  });
});


// POST "/update-password"
router.post("/update-password", passport.authenticate("jwt", {session: false}), (req, res, next) => {
  let body = req.body;
  let response = {success: false};

  if (body.oldPass == body.newPass) {
    response.msg = "The new password must not match the old one";
    res.json(response);
  }
  else {
    User.updateUserPassword(body.id, body.oldPass, body.newPass, (err, updatedUser) => {
      if (err) {
        response.msg = err.msg || "There was an error updating the password";
        res.json(response);
      } else {
        response.success = true;
        response.msg = "Password updated successfuly";
        response.user = updatedUser;

        console.log("[%s] updated his password", updatedUser.username);
        res.json(response);
      }
    });
  }
});


// POST "/remove"
router.post("/remove", passport.authenticate("jwt", {session: false}), (req, res, next) => {
  let body = req.body;
  let response = {success: false};

  User.removeUser(body.id, (err, removedUser) => {
    if (err || !removedUser) {
      response.msg = err.msg || "There was an error removing the account";
      res.json(response);
    } else {
      response.success = true;
      response.msg = "Account removed successfuly";
      response.user = removedUser;

      console.log("[%s] removed his account", removedUser.username);
      res.json(response);
    }
  });
});


module.exports = router;
