import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('currentUser');
    if (name) {
      setCurrentUser(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser('');
  };

  return (
    <>
    <div className='navbar'>
      <div className='nav-link'>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/register">Signup</Link></li>
          <li><Link to='/my-complaints'>All Complaints</Link></li>
          {currentUser ? (
            <>
              <li className='user-name'>{currentUser}</li>
              <li><button onClick={handleLogout} className='logout-btn'>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>

    </div>
    <Outlet />

    </>
  );
};

export default Navbar;
