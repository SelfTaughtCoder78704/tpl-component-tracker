const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Component = require('../models/component-model');
const User = require('../models/user-model');


// Validation rules.
var loginValidate = [
  check('code', 'Code is required').not().isEmpty().escape()
];


// get all components route
router.get('/', ensureAuthenticated, (req, res) => {
  Component.find({ user: req.user._id })
    .then(components => {
      res.render('components', {
        components: components,
        user: req.user,
      });
    })
});

// new component form route
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('new-component', { user: req.user });
});

// find one component route
router.get('/:id', ensureAuthenticated, (req, res) => {
  Component.findOne({ _id: req.params.id })
    .then(component => {
      res.render('component', {
        component: component,
        user: req.user,
      });
    })
});

// create component and save it to User route
router.post('/new', ensureAuthenticated, loginValidate, (req, res) => {
  const newComponent = {
    codeType: req.body.codeType,
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    image: req.body.image,
    sanitizedCode: {
      html: req.body.html,
      css: req.body.css,
      js: req.body.js
    },
    user: req.user._id
  };

  Component.create(newComponent)
    .then(component => {
      req.user.components.push(component);
      req.user.save();
      res.redirect('/components');
    })
    .catch(err => console.log(err));
});




module.exports = router;