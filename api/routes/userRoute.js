const express = require("express")
const {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser, deleteUser
} = require("../controllers/userController");
const {protect, adminOnly} = require("../middleware/authMiddleware");


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.get('/getUser', protect, getUser)
router.patch('/updateUser', protect, updateUser)
router.delete('/deleteUser/:id', protect, adminOnly, deleteUser)


module.exports = router