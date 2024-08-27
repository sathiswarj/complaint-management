import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [currentAdmin, setCurrentAdmin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('currentAdmin');
    console.log('Retrieved currentAdmin:', admin);  
    if (admin) {
      setCurrentAdmin(admin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentAdmin');
    setCurrentAdmin('');
    navigate('/admin/login');
  };

  return (
    <div className='navbar'>
      <div className='nav-link'>
        <ul>
          <li><Link to="/admin/panel">Complaint Panel</Link></li>
          {currentAdmin ? (
            <>
              <li className='user-name'>{currentAdmin}</li>
              <button onClick={handleLogout} className='logout-btn'>Logout</button>
            </>
          ) : (
            <li><Link to="/admin/">Login</Link></li>
          )}
        </ul>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavbar;
