import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Login = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiURL = "https://complaint-management-one.vercel.app";

  const handleSubmit = async (e) => {
 e.preventDefault();
    try {
      const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', data.user.name);
        navigate('/home');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-title'>
          <h1 style={{ color: 'white' }}>Login</h1>
        </div>
        <div className='card-body'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='email'
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className='form-control'
                placeholder='Email'
                required
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control'
                placeholder='Password'
                required
              />
            </div>
            <div className='form-group'>
              <input
                type='submit'
                value='Submit'
                className='btn btn-primary'
              />
            </div>
          </form>
          <div className="account">
            <p style={{ color: 'white' }}>
              New account? <Link to="/register" style={{ color: 'black', textDecoration: 'none' }}>Register now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
