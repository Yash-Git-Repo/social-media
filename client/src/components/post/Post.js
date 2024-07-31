
import './Post.scss'
import bgImg from '../../Assets/bg.jpg'
import Avatar from '../avatar/Avatar'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { likeAndUnlikePost } from '../../redux/slices/postSlice'
import { useNavigate } from 'react-router-dom'

function Post({ post }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    async function handlePostLike() {
        dispatch(
            likeAndUnlikePost({
                postId: post._id,
            }),
        )
    }

    return (
        <div className='Post'>
            <div className="heading" onClick={() => { navigate(`/profile/${post.owner._id}`) }}>
                <Avatar />
                <h4>{post?.owner?.name}</h4>
            </div>
            <div className="content">
                <img src={bgImg} alt="bgImg" />
            </div>
            <div className="footer">
                <div className="like" onClick={handlePostLike}>
                    {post?.isLiked ? (
                        <AiFillHeart className="icon" style={{ color: "red" }} />
                    ) : (
                        <AiOutlineHeart className="icon" />
                    )}
                    <h4>{post?.likes} Likes</h4>
                </div>
                <p className='caption'>{post?.caption}</p>
                <h6 className='time-ago'>{post?.timeAgo}</h6>
            </div>
        </div>
    )
}

export default Post

