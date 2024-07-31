import React from 'react'
import './Avatar.scss'
import userImg from '../../Assets/user.png'

function Avatar({src}) {
  return (
    <div className='Avatar'>
        <img src={src ? src : userImg } alt="" />
    </div>
  )
}

export default Avatar