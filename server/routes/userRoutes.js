const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all users
// @route GET apid/users
router.get('/', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user by ID
// @route GET api/users/:id
router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({msg: 'User not found'});
        }
        res.json(user);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a user
// @route DELETE api/users/:id
router.delete('/:id', auth, async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({msg: 'User not found'});
        }
        await user.deleteOne();
        res.json({msg: 'User removed'});
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;