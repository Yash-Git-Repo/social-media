import React, { useEffect, useState } from 'react'
import './Follower.scss'
import Avatar from '../avatar/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollow } from '../../redux/slices/feedSlice'
import { useNavigate } from 'react-router-dom'

function 
Follower({user}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const feedData = useSelector(state => state.feedSliceReducer.feedData)
    const [isFollowing, setIsFollowing] = useState(false)

    function handleFollowUnfollow () {
        dispatch(followAndUnfollow({userIdToFollow:user._id}))
    }
    useEffect(() => {
        if (feedData) {
            setIsFollowing(feedData.followings.some(item => item._id === user._id))
        }
    }, [feedData])
    return (
        <div className='Follower'>
            <div className="user-info" onClick={() =>{navigate(`/profile/${user?._id}`)}}>
                <Avatar src={user?.avatar?.url} />
                <h4 className="name">{user?.name}</h4>
            </div>
            <h5 onClick={handleFollowUnfollow} className={isFollowing ? 'hover-link follow-link' : 'btn-primary'}>{isFollowing ? 'Unfollow' : 'Follow'}</h5>
        </div>
    )
}

export default Follower