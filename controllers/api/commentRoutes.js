const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//add a post
router.post('/', async (req, res) => {
    try {
        const postData = await Post.create({
            user_id: req.session.user_id,
            title: req.body.title,
            text: req.body.text,
            createdDate: new Date().toDateString()
        });
        res.status(200).json(postData);
      } catch (err) {
        res.status(400).json(err);
      }
});

//add a comment
router.post('/:post_id', async (req, res) => {
    try {
        const commentData = await Comment.create({
            user_id: req.session.user_id,
            post_id: req.params.post_id,
            text: req.body.text,
            createdDate: new Date().toDateString()
        });
        res.status(200).json(commentData);
      } catch (err) {
        res.status(400).json(err);
      }
});

//delete a post
router.delete('/:post_id', async (req, res) => {
    try {
        const postData = await Post.destroy({
          where: {
            id: req.params.post_id,
          },
        });
    
        if (!postData) {
          res.status(404).json({ message: 'No library card found with that id!' });
          return;
        }
    
        res.status(200).json(postData);
      } catch (err) {
        res.status(500).json(err);
      }
});

//update a post
router.put('/:post_id', async (req, res) => {
    try{
        const postData = await Post.update(
            {
              title: req.body.title,
              text: req.body.text,
            },
            {
              where: { id: req.params.post_id },
            }
        )
        res.status(200).json(postData);
    }catch (err) {
        res.status(500).json(err);
    }
});

//get all posts
router.get('/', async (req, res) => {
    try {
        const postsData = await Post.findAll({
          include: [{ model: Comment }],
        });
        res.status(200).json(postsData);
      } catch (err) {
        res.status(500).json(err);
      }
});

//get all posts of one user
router.get('/:user_id', async (req, res) => {
    try {
        const postsData = await Post.findAll({
          include: [{ model: Comment }],
          where: { user_id: req.params.user_id}
        });
        res.status(200).json(postsData);
      } catch (err) {
        res.status(500).json(err);
      }
});

module.exports = router;
