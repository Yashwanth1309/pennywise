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
const Authentication = require('./routes/Authentication.js')
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
app.use('/pennywise/user', Authentication)
app.get('/', isLoggedIn, (req, res) => {
    res.send('Home')
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})