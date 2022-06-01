const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const Component = require('../models/component-model');
const User = require('../models/user-model');



/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  //find all components and sort by newest first, limit to 5 populate the user who created it
  Component.find({})
    .sort({ createdAt: 'desc' })
    .limit(5)
    .populate('user')
    .exec((err, components) => {
      if (err) {
        console.log(err);
      } else {
        res.render('dashboard', {
          components: components,
          user: req.user,
        });
      }
    });
});














module.exports = router;