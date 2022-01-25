const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/Users')
const mongoose = require("mongoose");
const {Schema} = mongoose

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user =  await User.findOne({email: email})
    if (!user) {
        return done(null, false, {message: 'Not user found'})
    } else {
        const match = user.matchPassword(password)
        // console.log(match1)
        console.log(match)
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, {message: 'incorrect password'})
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})