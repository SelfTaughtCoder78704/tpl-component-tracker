const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const Component = require('../models/component-model');
const User = require('../models/user-model');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  // find all components that belong to the user and render the dashboard
  Component.find({ user: req.user._id })
    .then(components => {
      res.render('dashboard', {
        components: components,
        user: req.user,
      });
    })
);




module.exports = router;