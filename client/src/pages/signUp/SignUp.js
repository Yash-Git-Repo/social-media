import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./SignUp.scss"
import { axiosClient } from '../../utils/axiosClient'

function SignUp() {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        try {
             await axiosClient.post('/auth/signUp', {
                name,
                email,
                password
            })
            navigate('/login')
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div className='SignUp'>
            <div className='SignUp-box'>
                <h2 className='heading'>Login</h2>
                <form onSubmit={handleSubmit}>

                    <label htmlFor='name'>Name</label>
                    <input type='name' className='name' id='name' onChange={(e) => {
                        setName(e.target.value)
                    }}></input>

                    <label htmlFor='email'>Email</label>
                    <input type='email' className='email' id='email' onChange={(e) => {
                        setEmail(e.target.value)
                    }}></input>

                    <label htmlFor='password'>Password</label>
                    <input type='password' className='password' id='password' onChange={(e) => {
                        setPassword(e.target.value)
                    }}></input>

                    <input type='submit' className='submit' />
                </form>
                <p className='sub-heading'>Already have an account ? <Link to='/login'>Login</Link> </p>
            </div>
        </div>
    )
}

export default SignUp