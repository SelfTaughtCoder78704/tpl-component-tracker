const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//LOAD USER MODEL
const User = require("../models/user-model");

//LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

//REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register", { user: req.user });
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errrors.push({ msg: "PLEASE ENTER ALL FIELDS" });
  }

  if (password != password2) {
    errors.push({ msg: "PASSWORDS DO NOT MATCH" });
  }

  if (password.length < 6) {
    errors.push({ msg: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    //NEW USER OBJECT
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    //GENERATING HASH FOR PASSWORD
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            req.flash("success_msg", "YOU ARE NOW REGISTERED AND CAN LOG IN");
            res.redirect("/users/login");
          })
          .catch((err) => console.log(err));
      });
    });
  }
});

//LOGIN
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "YOU ARE LOGGED OUT");
  res.redirect("/users/login");
});

module.exports = router;
