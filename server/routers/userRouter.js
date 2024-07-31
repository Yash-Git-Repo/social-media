const router = require('express').Router()
const userController = require('../controllers/userController')
const requireUser = require("../middlewares/requireUser")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/followUnfollow', requireUser, userController.followUnfollowUser)
router.get('/getPostOfFollowing', requireUser, userController.getPostsOfFollowing)
router.get('/getMyPosts', requireUser, userController.getMyPosts)
router.get('/getUserPosts', requireUser, userController.getUserPosts)
router.post('/getUserProfile', requireUser, userController.getUserProfile)
router.get('/getMyInfo', requireUser, userController.getMyInfo)
router.put('/updateUserProfile', requireUser, userController.updateUserProfile)


module.exports = router
