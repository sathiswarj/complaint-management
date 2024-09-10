import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiURL = "https://complaint-management-cmqf.vercel.app";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiURL}/admin-login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful');
        localStorage.setItem('token', data.token);
        navigate('/admin/panel');
      } else if (response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('An error occurred, please try again.');
      }
    } catch (err) {
      setError('An error occurred, please try again.');
    }
  };

  return (
    <>
      {error && <p className='error'>{error}</p>}
      <div className='container-fluid'>
        <div className='card'>
          <div className='card-title'>
            <h1 style={{ color: 'white' }}>Login</h1>
          </div>
          <div className='card-body'>
            <form onSubmit={handleLogin}>
              <div className='form-group'>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
