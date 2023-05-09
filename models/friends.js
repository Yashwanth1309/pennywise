const mongoose = require('mongoose')
const User = require('./user.js')
const friendsSchema = new mongoose.Schema({
    email: {
        // type: mongoose.Schema.Types.ObjectId,
        type:String,
        default:"user123",
        required: true,
        ref: 'User'
    },
    friends: [{
      date: {
          type: Date,
          default: Date.now
      },
      type:{
        type:String
      },
        name: {
            type: String,
            required: true,
            // unique: true
        },
        reason:{
          type:String
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        },

    }]
});
const Friends = new mongoose.model('Friend', friendsSchema)
module.exports = Friends
