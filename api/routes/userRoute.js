const express = require("express")
const {
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
} = require("../controllers/userController");
const {protect, adminOnly, authorOnly} = require("../middleware/authMiddleware");


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.get('/getUser', protect, getUser)
router.patch('/updateUser', protect, updateUser)
router.delete('/deleteUser/:id', protect, adminOnly, deleteUser)

router.get('/getUsers', protect, authorOnly, getUsers)
router.post('/upgradeUser', protect, adminOnly, upgradeUser)

router.get('/loginStatus', loginStatus)

router.post('/sendAutomatedEmail', protect, sendAutomatedEmail)
router.post('/sendVerificationEmail', protect, sendVerificationEmail)

router.patch('/verifyUser/:verificationToken', verifyUser)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:resetToken', resetPassword)
router.patch('/changePassword', protect, changePassword)
router.post('/sendLoginCode/:email', protect, sendLoginCode)
router.post('/loginWithCode/:email', protect, loginWithCOde)


module.exports = router