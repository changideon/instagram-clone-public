require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// User Registration
// @route POST api/auth/register
router.post(
    '/register', 
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {username, email, password} = req.body;

        try {
            let user = await User.findOne({email});
            if(user) {
                return res.status(400).json({msg: 'User already exists'});
            }

            user = new User({
                username,
                email,
                password
            });

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_Secret,
                {expiresIn: 360000},
                (err, token) => {
                    if(err) throw err;
                    res.json({token});
                }
            );
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// User Login
// @route POST api/auth/login
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], 
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            let user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).jsong({errors: [{msg: 'Invalid Credentials'}] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 360000},
                (err, token) => {
                    if(err) throw err;
                    res.json({token});
                }
            );
        }
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server error in login route');
        }
    }
);

module.exports = router;