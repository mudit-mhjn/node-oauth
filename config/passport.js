const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');

// In-memory user store
const users = [];

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'No user' });
    if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Wrong password' });
    }
    return done(null, user);
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "dummy",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    let user = users.find(u => u.googleId === profile.id);
    if (!user) {
        user = {
            id: users.length + 1,
            username: profile.displayName,
            googleId: profile.id,
            provider: 'google'
        };
        users.push(user);
    }
    return done(null, user);
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || "dummy",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "dummy",
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
    let user = users.find(u => u.facebookId === profile.id);
    if (!user) {
        user = {
            id: users.length + 1,
            username: profile.displayName,
            facebookId: profile.id,
            provider: 'facebook'
        };
        users.push(user);
    }
    return done(null, user);
}));

// Export user store for signup
module.exports = { users };
