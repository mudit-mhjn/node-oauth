const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { users } = require('../config/passport');
const router = express.Router();

// Local login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login'
    })
);

// Local signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.redirect('/signup');
    }
    const user = {
        id: users.length + 1,
        username,
        password: bcrypt.hashSync(password, 10),
        provider: 'local'
    };
    users.push(user);
    req.login(user, err => {
        if (err) return res.redirect('/signup');
        res.redirect('/home');
    });
});

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

// Facebook OAuth
router.get('/facebook',
    passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

module.exports = router;
