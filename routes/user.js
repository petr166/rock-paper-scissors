const express = require('express');
const router = express.Router();
const User = require('../models/user');


// POST "/register"
router.post("/register", (req, res, next) => {
  let body = req.body;
  let response = {success: false};

  let newUser = new User({
    name: body.name,
    username: body.username,
    email: body.email,
    password: body.password,
    avatar: "https://api.adorable.io/avatars/140/abott@adorable.png",
    played: 0,
    wins: 0,
    matches: []
  });

  User.addUser(newUser, (err, addedUser) => {
    if (err) {
      response.msg = err.msg || "Failed to register user";
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


module.exports = router;
