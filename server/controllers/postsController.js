const Posts = require("../models/Posts")
const User = require("../models/User")
const {mapPostOutput} = require("../utils/mapPostOutput")
const { success, error } = require("../utils/responseWrapper")

const createPostsController = async (req, res) => {
    try {
      const { caption } = req.body
      if (!caption ) {
        return res.send(error(404, 'Caption is required'))
      }
      const owner = req._id
      const user = await User.findById(req._id)
      const post = await Posts.create({
        owner,
        caption,
      })
      user.posts.push(post.id)
      await user.save()
      return res.send(success(201, post))
    } catch (e) {
      res.send(error(500, e.message))
    }
  }

const likeAndUnlikePostsController = async (req, res) => {
    try {
        const { postId } = req.body
        const curUsrId = req.id
        const post = await Posts.findById(postId).populate('owner')
        if (!post) {
          return res.send(error(404, 'Post not found'))
        }
        if (post.likes.includes(curUsrId)) {
          const index = post.likes.indexOf(curUsrId)
          post.likes.splice(index, 1)
        } else {
          post.likes.push(curUsrId)
        }
        await post.save()
        return res.send(success(200, {post: mapPostOutput(post,req.id)}))
      } catch (e) {
        return res.send(error(500, e.message))
      }
}

const updatePost = async (req, res) => {
    try {
        const { postId, caption } = req.body
        const curUserId = req._id

        const post =await Posts.findById(postId)
        if (!postId) {
            return res.send(success(404, "Post not Found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only post owner can update the posts"))
        }

        if (caption) {
            post.caption = caption
        }

        await post.save()
        return res.send(success(200, post))
    } catch (e) {
        console.log(e);
        return res.send(error(501, e.message))
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.body
        const curUserId = req._id

        if (!postId) {
            return res.send(error(400, "Post Id is required"));
        }

        const post =await Posts.findById(postId)
        if (!post) {
            return res.send(success(404, "Post not Found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only post owner can update the posts"))
        }

        const curUser = await User.findById(curUserId)
        const  index = curUser.posts.indexOf(post)
        curUser.posts.splice(index,1)

        await curUser.save()
        await post.deleteOne()
        return res.send(success(200, "post Deleted"))
    } catch (e) {
        console.log(e);
        return res.send(error(501, e.message))
    }
}
module.exports = { createPostsController, likeAndUnlikePostsController,updatePost, deletePost }