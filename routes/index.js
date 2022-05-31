const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const Component = require('../models/component-model');
const User = require('../models/user-model');

let newComponent = {};

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  //find all components that belong to the user, then find the newest component created by any user

  Component.find({ user: req.user.id })
    .then(components => {
      Component.find({})
        .sort({ createdAt: -1 })
        .limit(1)
        .then(newest => {
          newestComponent = newest[0] || newComponent;
        })
        .then(() => {
          User.find({ user: newComponent.user })
            .then(user => {
              res.render('dashboard', {
                components: components,
                newest: newestComponent,
                newestUser: user[0],
                user: req.user,
              });
            })
        })
    })
});













module.exports = router;