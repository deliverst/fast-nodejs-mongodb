const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const passport = require('passport')


router.get('/users/signing', (req, res) => {
    res.render('users/signing');
})


router.post('/users/signing', passport.authenticate('local', {
    successRedirect: '/notes', failureRedirect: '/users/signing', failureFlash: true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/users/signup', async (req, res) => {
    let errors = [];
    const {name, email, password, confirm_password} = req.body;
    if (password != confirm_password) {
        errors.push({text: "Passwords do not match."});
    }
    if (password.length < 4) {
        errors.push({text: "Passwords must be at least 4 characters."});
    }
    if (errors.length > 0) {
        res.render("users/signup", {
            errors, name, email, password, confirm_password,
        });
    } else {
        // Look for email coincidence
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash("error_msg", "The Email is already in use.");
            res.redirect("/users/signup");
        } else {
            // Saving a New User
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash("success_msg", "You are registered.");
            res.redirect("/users/signing");
        }
    }
})


router.get('/user/loguot', (req, res) => {
    req.logout()
    res.redirect('/')
})
module.exports = router;