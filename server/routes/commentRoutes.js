const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Comment on a post
// @route POST api/comments/:post_id
router.post(
    '/:post_id',
    [auth, [check('text', 'Text is required').not().isEmpty()]],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const post = await Post.findById(req.params.post_id);

            const newComment = new Comment({
                text: req.body.text,
                name: req.user.username,
                user: req.user.id,
                post: req.params.post_id
            });

            post.comments.unshift(newComment);
            await newComment.save();
            await post.save();
            
            res.json(newComment);
        }
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// Delete a comment
// @route DELETE api/comments/:post_id/:comment_id
router.delete('/:post_id/:comment_id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        const com = await Comment.findById(req.params.comment_id);

        await com.deleteOne();

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        let comment = null;
        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i]._id.toString() === (req.params.comment_id)) {
                comment = post.comments[i];
                break;
            }
        }

        if(!comment) {
            return res.status(404).json({msg: 'Comment does not exist'});
        }

        // Check if comment.user is defined before calling toString
        if (!comment.user) {
            return res.status(500).json({ msg: 'Comment user not defined' });
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        const removeIndex = post.comments
        .map((comment) => comment.id)
        .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json({msg: "Comment deleted"});
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;