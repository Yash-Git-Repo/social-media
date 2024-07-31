import React, { useEffect } from 'react'
import './Feed.scss'
import Post from '../post/Post';
import Follower from '../follower/Follower';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedData } from '../../redux/slices/feedSlice';

function Feed() {
    const dispatch = useDispatch()
    const feedData = useSelector(state => state.feedSliceReducer.feedData)
    console.log('feedData', feedData);

    useEffect(() => {
        dispatch(getFeedData())
    }, [])

    return (
        <div className="Feed">
            <div className="container">
                <div className="left-part">
                    {feedData?.posts?.map(item => <Post key={item._id} post={item} />)}
                </div>
                <div className="right-part">
                    <div className="following">
                        <h3 className="title">You are following :</h3>
                        {feedData?.followings?.map(item => <Follower key={item._id} user={item} />)}
                    </div>
                    <div className="suggestions"></div>
                    <h3 className="title">Suggested for you :</h3>
                    {feedData?.suggestions?.map(item => <Follower key={item._id} user={item} />)}
                </div>
            </div>
        </div>
    );
}

export default Feed