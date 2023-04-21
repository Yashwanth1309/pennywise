if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const MongoDbStore = require('connect-mongo')
const localStrategy = require('passport-local')
const mongo_sanitize = require('express-mongo-sanitize')
const User = require('./models/user.js')
const Expense = require('./models/expense.js')
const Friend = require('./models/friends.js')
const isLoggedIn = require('./middlewares/middleware.js')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(mongo_sanitize())
app.use(express.json());
const secret = process.env.secret || 'SAVEMONEY'
const store = new MongoDbStore({
    mongoUrl: process.env.DB_URL,
    secret,
    touchAfter: 24 * 60 * 60
})
store.on('error', function(e) {
    console.log(e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database connected")
    })
    .catch((e) => {
        console.error.bind(e)
    })
app.post('/register', async(req, res) => {
    try {
        const { email, username, password, phno } = req.body
        const user = new User({ email, username, phno })
        const registeredUser = await User.register(user, password)

        req.logIn(registeredUser, err => {
            if (err) {
                return next(err)
            }
        })
        res.redirect('/')
    } catch (error) {
        // console.log(e.message)
        res.redirect('/register')
    }
})
app.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/login' }), (req, res) => { res.send('login') })
app.get('/login', (req, res) => {
    res.send('Please login')
})
app.get('/logout', isLoggedIn, (req, res) => {
    req.logOut((e) => {
        if (e) {
            console.log(e)
            return
        }
        return res.redirect('/login')
    })
    res.redirect('/login')
})
app.get('/', isLoggedIn, async(req, res) => {
    res.send('<h1>Home of pennywise</h1>')
})
app.listen(3000, () => {
    console.log('Listening to port 3000')
})