const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Component = require('../models/component-model');
const User = require('../models/user-model');


// Validation rules.
var codeSanitize = [
  check('code', 'Code is required').not().isEmpty().escape()
];


// get all components route
router.get('/', ensureAuthenticated, (req, res) => {
  Component.find({})
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
router.post('/new', ensureAuthenticated, codeSanitize, (req, res) => {
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

// edit form route
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
  Component.findOne({ _id: req.params.id })
    .then(component => {
      res.render('edit-component', {
        component: component,
        user: req.user,
      });
    })
});


// find one component and update it route
router.put('/:id', ensureAuthenticated, (req, res) => {
  Component.findOne({ _id: req.params.id })
    .then(component => {
      component.codeType = req.body.codeType;
      component.name = req.body.name;
      component.description = req.body.description;
      component.tags = req.body.tags;
      component.image = req.body.image;
      component.sanitizedCode = {
        html: req.body.html,
        css: req.body.css,
        js: req.body.js
      };
      component.save();
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});


// find one component and delete it route
router.get('/:id/delete', ensureAuthenticated, (req, res) => {
  Component.findOne({ _id: req.params.id })
    .then(component => {
      component.remove();
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

// find all components by name that partially match the search term
router.post('/search', ensureAuthenticated, (req, res) => {
  Component.find({ name: { $regex: req.body.search, $options: 'i' } })
    .then(components => {
      res.render('components', {
        components: components,
        user: req.user,
      });
    })
});






module.exports = router;