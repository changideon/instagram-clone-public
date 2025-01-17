const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
// @route POST api/posts
router.post('/', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            caption: req.body.caption,
            name: user.username,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all posts
// @route GET api/posts
router.get('/', async(req, res) => {
    try{
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get post by ID
// @route GET api/posts/:id
router.get('/:id', async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }

        res.json(post);
    }
    catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

// Delete a post
// @route DELETE api/posts/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
      
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
      
        await post.deleteOne();
      
        res.json({ msg: 'Post removed' });
    }   
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;