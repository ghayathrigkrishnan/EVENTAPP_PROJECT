import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <nav className="navbar">
      <img src="/logo.jpg" alt="Logo" className="navbar-logo" />
      <div className="navbar-links">
        <button className="navbar-button" onClick={() => navigate('/')}>Home</button>

        {!token && (
          <>
            <button className="navbar-button" onClick={() => navigate('/login')}>Login</button>
            <button className="navbar-button" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}

        {token && (
          <button className="navbar-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
        )}

        <button className="navbar-button" onClick={() => navigate('/admin')}>Admin</button>
      </div>
    </nav>
  );
};

export default Navbar;
