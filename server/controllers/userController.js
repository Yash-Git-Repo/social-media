const Posts = require("../models/Posts")
const User = require("../models/User")
const { mapPostOutput } = require("../utils/mapPostOutput")
const { success, error } = require("../utils/responseWrapper")
const cloudinary = require('cloudinary').v2

const followUnfollowUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body
        const curUserId = req._id

        const userToFollow = await User.findById(userIdToFollow)
        const curUser = await User.findById(curUserId)

        if (curUserId === userIdToFollow) {
            return res.send(error(409, "User cannot follow themselves"))
        }

        if (!userToFollow) {
            return res.send(error(404, "User to follow not found"))
        }

        //Already followed
        if (curUser.followings.includes(userIdToFollow)) {
            const followingindex = curUser.followings.indexOf(userIdToFollow)
            curUser.followings.splice(followingindex, 1)

            const followerIndex = userToFollow.followers.indexOf(curUserId)
            userToFollow.followers.splice(followerIndex, 1)
        } else {
            curUser.followings.push(userIdToFollow)
            userToFollow.followers.push(curUserId)
        }
        await userToFollow.save()
        await curUser.save()
        return res.send(success(200,
            { user: userToFollow }
        ))

    } catch (e) {
        return res.send(error(501, e.message))
    }
}

const getPostsOfFollowing = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate("followings");
        const fullPosts = await Posts.find({
            owner: {
                $in: curUser?.followings,
            },
        }).populate("owner");

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        const followingsId = curUser?.followings.map((item) => item.id);
        followingsId.push(req._id)
        const suggestions = await User.find({
            _id: {
                $nin: followingsId,
            },
        });
        return res.send(success(200, { ...curUser._doc, suggestions, posts }));
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }
}

const getMyPosts = async (req, res) => {
    try {
        const curUserId = req._id
        const allUserPosts = await Posts.find({
            owner: curUserId
        })

        return res.send(success(200, allUserPosts))
    } catch (e) {
        return res.send(error(501, e.message))
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return res.send(error(404, "UserID is required"))
        }
        const allUserPosts = await Posts.find({
            owner: userId
        })

        return res.send(success(200, allUserPosts))
    } catch (e) {
        return res.send(error(501, e.message))
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path: "posts",
            populate: {
                path: "owner",
            },
        });

        const fullPosts = user.posts;
        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { ...user._doc, posts }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};


const deleteMyProfile = async (req, res) => {
    try {
        const curUserId = req._id
        const curUser = await User.findById(curUserId)

        //delete all posts
        await Posts.deleteMany({
            owner: curUserId
        })

        // Remove myself from followers following
        // curUser.followers.forEach(async (followerId) => {
        //     const follower = await User.findById(followerId)
        //     const index = follower.followings.indexOf(curUserId)
        //     follower.followings.splice(index, 1)
        //     await follower.save()
        // })
        for (const followerId of curUser.followers) {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            await follower.followings.splice(index, 1);
            await follower.save();
        }


        // Remove myself from followings' followers
        //Another way
        // curUser.followings.forEach(async (followingsId) => {
        //     const following = await User.findById(followingsId)
        //     const index = following.followers.indexOf(curUserId)
        //     following.followers.splice(index, 1)
        //     await following.save()
        // })
        for (const followingId of curUser.followings) {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            await following.followers.splice(index, 1);
            await following.save();
        }



        await User.deleteOne({ _id: curUserId });

        return res.send(success(200, "User deleted successfully"))
    } catch (e) {
        return res.send(error(501, e.message))
    }
}

const getMyInfo = async (req, res) => {
    try {
        const curUserId = req._id
        const getInfo = await User.findById(curUserId)

        return res.send(success(200, { getInfo }))
    } catch (e) {
        return res.send(error(501, e.message))
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;
        const user = await User.findById(req._id);
        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            try {
                const cloudImg = await cloudinary.uploader.upload(userImg, {
                    folder: "profileImg",
                });
                user.avatar = {
                    url: cloudImg.secure_url,
                    publicId: cloudImg.public_id,
                };
            } catch (error) {
                // console.error('Error uploading image:', error);
            }
        }

        await user.save();
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};


module.exports = { followUnfollowUser, getPostsOfFollowing, getMyPosts, getUserPosts, deleteMyProfile, getMyInfo, updateUserProfile, getUserProfile }