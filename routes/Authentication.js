const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport = require('passport')
router.post('/register', async(req, res) => {
    try {
        const { email, username, password, phno } = req.body
        const user = new User({ email, username, password, phno })
        const registeredUser = await User.register(user, password)

        req.logIn(registeredUser, err => {
            if (err) {
                return next(err)
            }
        })
        res.redirect('/')
    } catch (error) {
        res.redirect('/register')
    }
})
router.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), (req, res) => {
    res.send('loggedIn')
})
router.get('/login', (req, res) => {
    res.send('Please login')
})
router.get('/logout', (req, res) => {
    req.logOut((e) => {
        if (e) {
            console.log(e)
            return
        }
        return res.redirect('/pennywise/user/login')
    })
    res.redirect('/pennywise/user/login')
})
module.exports = router