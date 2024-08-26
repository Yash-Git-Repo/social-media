import React, { useState } from 'react';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorageManager';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password
      });
      setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='login'>
      <div className='login-box'>
        <h2 className='heading'>Login</h2>
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            className='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor='password'>Password</label>
          <input
            type='password'
            className='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type='submit' className='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='sub-heading'>
          Don't have an account? <Link to='/signUp'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
