const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
);

// Encrypt password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = mongoose.model('User', userSchema)
module.exports = User