import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register-user', { email, password });
      toast.success("Signup successful!");
      navigate('/login');

      navigate('/login');
    } catch (err) {
     toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create an Account</h2>
      <form onSubmit={handleSignup} className="reg-form">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
