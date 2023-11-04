const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
  try {
    const postsData = await Post.findAll({
      include: [{ model: Comment }],
    });

    const posts =  postsData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/dashboard', withAuth, async (req, res) => {
  // If a session exists, redirect the request to the homepage
  try {
    const postsData = await Post.findAll({
      include: [{ model: Comment }],
      where: { user_id: req.session.user_id}
    });

    const posts = postsData.map((project) => project.get({ plain: true }));

    res.render('dashboard', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
  
});

router.get('/signUp', (req, res) => {
  // If a session exists, redirect the request to the homepage
  res.render('signUp');
});

module.exports = router;
