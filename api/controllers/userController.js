const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {generateToken} = require("../utils");
const parser = require('ua-parser-js');
const {async} = require("nodemon");

// register user
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill in all the required fields.')
    }

    if (password.length < 6) {
        res.status(400)
        throw new Error('Password must be al least 6 character.')
    }

    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error('Email already in use.')
    }

    // Get UserAgent
    const ua = parser(req.headers['user-agent']);
    // console.log(ua)
    const userAgent = [ua.ua]

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        userAgent
    })

    // Generate Token
    const token = generateToken(user._id)

    // Set HTTP_ONLY Cookie
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: 'none',
        secure: true
    })

    if (user) {
        const {_id, name, email, phone, bio, photo, role, isVerified} = user

        res.status(201).json({
            _id, name, email, phone, bio, photo, role, isVerified, token
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

});

// login user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // Validation
    if (!email || !password) {
        res.status(400)
        throw new Error('Please add email and password');
    }

    const user = await User.findOne({email});
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
        res.status(404)
        throw new Error('Invalid email or password');
    }

    // Trigger 2FA for unknown UserAgent

    // Generate Token
    const token = generateToken(user._id);

    if (user && passwordIsCorrect) {
        // Set HTTP_ONLY Cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: 'none',
            secure: true
        })

        const {_id, name, email, phone, bio, photo, role, isVerified} = user

        res.status(200).json({
            _id, name, email, phone, bio, photo, role, isVerified, token
        });

    } else {
        res.status(400)
        throw new Error('Something went wrong, pleases try again');
    }

});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true
    });

    return res.status(200).json({message: 'Logout successful'});
});

// get user
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const {_id, name, email, phone, bio, photo, role, isVerified} = user

        res.status(200).json({
            _id, name, email, phone, bio, photo, role, isVerified
        });

    } else {
        res.status(404)
        throw new Error('User not found');
    }
})

// update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const {name, email, phone, bio, photo, role, isVerified} = user

        user.email = email
        user.name = req.body.name || name
        user.phone = req.body.phone || phone
        user.bio = req.body.bio || bio
        user.photo = req.body.photo || photo

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
            photo: updatedUser.photo,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified
        });

    } else {
        res.status(404)
        throw new Error('User not found');
    }

})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser
}