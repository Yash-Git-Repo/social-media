const router = require('express').Router()
const postController = require('../controllers/postsController')
const requireUser = require("../middlewares/requireUser")

router.post('/createPost',requireUser,postController.createPostsController)
router.post('/likeAndUnlike',requireUser,postController.likeAndUnlikePostsController)
router.put('/updatePost',requireUser,postController.updatePost)
router.delete('/deletePost',requireUser,postController.deletePost)



module.exports = router
