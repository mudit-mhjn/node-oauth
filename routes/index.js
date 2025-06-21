const express = require('express');
const router = express.Router();

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

router.get('/', (req, res) => res.redirect('/home'));

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/home');
    res.sendFile('login.html', { root: 'views' });
});

router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/home');
    res.sendFile('signup.html', { root: 'views' });
});

router.get('/home', ensureAuth, (req, res) => {
    res.sendFile('home.html', { root: 'views' });
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

module.exports = router;
