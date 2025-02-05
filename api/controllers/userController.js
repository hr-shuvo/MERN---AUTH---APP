const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {generateToken, hashToken} = require("../utils");
const parser = require('ua-parser-js');
const {async} = require("nodemon");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const crypto = require('crypto')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);


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
    // Get UserAgent
    const ua = parser(req.headers['user-agent']);
    const thisUserAgent = ua.ua

    const allowedAgent = user.userAgent.includes(thisUserAgent)
    if (!allowedAgent) {
        // Generate 6 digit code
        const loginCode = Math.floor(100000 + Math.random() * 900000)
        console.log(loginCode)

        // Encrypt login code before saving to DB
        const encryptedLoginCode = cryptr.encrypt(loginCode.toString())

        let userToken = await Token.findOne({userId: user._id});
        if (userToken) {
            await userToken.deleteOne()
        }

        // Save token to DB

        await new Token({
            userId: user._id,
            lToken: encryptedLoginCode,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * (60 * 1000) // 10 minutes
        }).save();

        res.status(400)
        throw new Error('New browser or device detected')
    }

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

// Send login code
const sendLoginCode = asyncHandler(async (req, res) => {
    const {email} = req.params

    const user = await User.findOne({email})
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    // Find login code in db
    const userToken = await Token.findOne({userId: user._id, expiresAt: {$gt: Date.now()}})
    if (!userToken) {
        res.status(404)
        throw new Error('Invalid or Expire token, please login again');
    }

    const loginCode = userToken.lToken;
    const decryptedLoginCode = cryptr.decrypt(loginCode)

    // Send Email - login code
    const subject = `Login access code - ${process.env.ORG_NAME}`
    const sendTo = email
    const sendFrom = process.env.SMTP_EMAIL_USER
    const replyTo = process.env.SMTP_EMAIL_NOREPLY
    const template = 'loginCode'
    const name = user.name
    const link = decryptedLoginCode

    try {
        await sendEmail(
            subject, sendTo, sendFrom, replyTo, template, name, link
        )

        res.status(200).json({message: `Access code sent to ${email}`})

    } catch (error) {
        res.status(500)
        // console.log(error)
        throw new Error('Email not sent, please try again');
    }

})

// login with code
const loginWithCOde = asyncHandler(async (req, res) => {
    const {email} = req.params
    const {loginCode} = req.body

    const user = await User.findOne({email});
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    // Find user login token
    const userToken = await Token.findOne({userId: user._id, expiresAt: {$gt: Date.now()}})
    if (!userToken) {
        res.status(404)
        throw new Error('Invalid or Expire token, please login again');
    }

    const decryptedLoginCode = cryptr.decrypt(userToken.lToken)

    if (loginCode !== decryptedLoginCode) {
        res.status(404)
        throw new Error('Incorrect login code, please try again');
    }else{


        // Register user agent

        const ua = parser(req.headers['user-agent']);
        const thisUserAgent = ua.ua

        const allowedAgent = user.userAgent.includes(thisUserAgent)
        if(!allowedAgent){
            user.userAgent.push(thisUserAgent);
            await user.save()
        }

        const token = generateToken(user._id)

        // Set HTTP_ONLY Cookie
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: 'none',
            secure: true
        })

        const {_id, name, email, phone, bio, photo, role, isVerified} = user

        res.status(201).json({
            _id, name, email, phone, bio, photo, role, isVerified, token
        });
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

// delete user
const deleteUser = asyncHandler(async (req, res) => {
    const user = User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();
    res.status(200).json({message: 'User deleted successfully'})
})

// get user list
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort('-createdAt').select('-password');

    if (!users) {
        res.status(500);
        throw new Error("Something went wrong");
    }

    res.status(200).json(users);
})

// get login Status
const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
        return res.json(true)
    }

    return res.json(false)
});

// upgrade user
const upgradeUser = asyncHandler(async (req, res) => {
    const {role, id} = req.body

    const user = await User.findById(id);

    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    user.role = role;
    await user.save()

    res.status(200).json({message: `User role updated to ${role}`})
})

// send automated emails
const sendAutomatedEmail = asyncHandler(async (req, res) => {
    const {subject, sendTo, replyTo, template, url} = req.body;

    if (!subject || !sendTo || !replyTo || !template) {
        res.status(500)
        throw new Error('Missing email parameter');
    }

    const user = await User.findOne({email: sendTo})
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    const sentFrom = process.env.SMTP_EMAIL_USER
    const name = user.name
    const link = `${process.env.FRONTEND_URL}${url}`


    try {
        await sendEmail(
            subject, sendTo, sentFrom, replyTo, template, name, link
        )

        res.status(200).json({message: 'Email sent'})

    } catch (error) {
        res.status(500)
        console.log(error)
        throw new Error('Email not sent, please try again');
    }

})

// verify email
const sendVerificationEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400)
        throw new Error('User already verified');
    }

    let token = await Token.findOne({userId: user._id});
    if (token) {
        await token.deleteOne()
    }

    // create token and save
    const verificationToken = crypto.randomBytes(32).toString('hex') + user._id;
    console.log('verification token: ', verificationToken)

    // Hash token and save
    const hashedToken = hashToken(verificationToken)

    await new Token({
        userId: user._id,
        vToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * (60 * 1000) // 10 minutes
    }).save();

    // construct verification url
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    // Send Email
    const subject = `Verify Your Account ${process.env.ORG_NAME}`
    const sendTo = user.email
    const sendFrom = process.env.SMTP_EMAIL_USER
    const replyTo = process.env.SMTP_EMAIL_NOREPLY
    const template = 'verifyEmail'
    const name = user.name
    const link = verificationUrl

    try {
        await sendEmail(
            subject, sendTo, sendFrom, replyTo, template, name, link
        )

        res.status(200).json({message: 'Verification Email sent'})

    } catch (error) {
        res.status(500)
        // console.log(error)
        throw new Error('Email not sent, please try again');
    }

})

// verify user
const verifyUser = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params

    const hashedToken = hashToken(verificationToken)

    const userToken = await Token.findOne({vToken: hashedToken, expiresAt: {$gt: Date.now()}})

    if (!userToken) {
        res.status(404)
        throw new Error('Invalid or Expired Token');
    }

    // Find User
    const user = await User.findOne({_id: userToken.userId})

    if (user.isVerified) {
        res.status(400)
        throw new Error('User already verified');
    }

    // Verify user
    user.isVerified = true
    await user.save()

    res.status(200).json({message: 'Account verification successful'})
})

// forgot password
const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body

    const user = await User.findOne({email: email})
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    let token = await Token.findOne({userId: user._id});
    if (token) {
        await token.deleteOne()
    }

    // create token and save
    const resetToken = crypto.randomBytes(32).toString('hex') + user._id;
    console.log('reset token: ', resetToken)

    // Hash token and save
    const hashedToken = hashToken(resetToken)

    await new Token({
        userId: user._id,
        rToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * (60 * 1000) // 10 minutes
    }).save();

    // construct reset url
    const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    // Send Email
    const subject = `Password Reset Request - ${process.env.ORG_NAME}`
    const sendTo = user.email
    const sendFrom = process.env.SMTP_EMAIL_USER
    const replyTo = process.env.SMTP_EMAIL_NOREPLY
    const template = 'forgotPassword'
    const name = user.name
    const link = resetUrl

    try {
        await sendEmail(
            subject, sendTo, sendFrom, replyTo, template, name, link
        )

        res.status(200).json({message: 'Password Reset Email sent'})

    } catch (error) {
        res.status(500)
        // console.log(error)
        throw new Error('Email not sent, please try again');
    }

})

// reset password
const resetPassword = asyncHandler(async (req, res) => {
    const {resetToken} = req.params
    const {password} = req.body

    const hashedToken = hashToken(resetToken)

    const userToken = await Token.findOne({rToken: hashedToken, expiresAt: {$gt: Date.now()}})

    if (!userToken) {
        res.status(404)
        throw new Error('Invalid or Expired Token');
    }

    // Find User
    const user = await User.findOne({_id: userToken.userId})
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    // Verify user
    user.password = password
    await user.save()

    res.status(200).json({message: 'Password Reset successful, please login'})

})

const changePassword = asyncHandler(async (req, res) => {
    const {oldPassword, password} = req.body;

    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }

    if (!oldPassword || !password) {
        res.status(400)
        throw new Error('Please enter old and new password');
    }

    // Check if old password is correct
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    if (passwordIsCorrect) {
        user.password = password
        await user.save()

        res.status(200).json({message: 'Password change successful, please re-login'})
    } else {
        res.status(400)
        throw new Error('Incorrect old password');
    }

})


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    deleteUser,
    getUsers,
    loginStatus,
    upgradeUser,
    sendAutomatedEmail,
    sendVerificationEmail,
    verifyUser,
    forgotPassword,
    resetPassword,
    changePassword,
    sendLoginCode,
    loginWithCOde
}