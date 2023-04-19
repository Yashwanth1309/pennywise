import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'
import { User } from './models/user.js'
import { Expense } from './models/expense.js'
import { Friends } from './models/friends.js'
const app = express()
app.get('/', (req, res) => {
    res.send('<h1>PENNYWISE</h1>')
})
app.listen(3000, () => {
    console.log('Listening to port 3000')
})