const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add a email'],
            unique: true,
            trim: true,
            // match: []
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        photo: {
            type: String,
            required: [true, 'Please add a photo'],
            default: 'https://ibb.co.com/0VVcZJB'
        },
        phone: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            required: true,
            default: 'subscriber', // author, admin, suspended
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        userAgent: {
            type: Array,
            required: true,
            default: []
        },
    },
    {
        timestamps: true,
        minimize: false
    }
)

const User = mongoose.model('User', userSchema)
module.exports = User