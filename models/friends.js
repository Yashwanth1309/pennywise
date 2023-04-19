import mongoose, { Mongoose } from "mongoose";
import { User } from "./user.js";
const friendsSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    friends: [{
        name: {
            type: String,
            required: true,
            unique: true
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        }
    }],

})
const Friends = new mongoose.model('Friend', friendsSchema)
export { Friends }