import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';


const Dashboard = () => {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchRegistration();
    }
  }, []);

  const fetchRegistration = async () => {
    try {
      const res = await axios.get('http://localhost:3000/me', {
        headers: { Authorization: token }
      });
      setRegistration(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registration");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:3000/me/delete', {
        headers: { Authorization: token }
      });
      toast.success("Registration deleted");
      setRegistration(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete registration");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info("Logged out");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Your Dashboard</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <CircularProgress color="inherit" />
        </div>
      ) : registration ? (
        <div>
          <p><strong>Name:</strong> {registration.name}</p>
          <p><strong>Event:</strong> {registration.event}</p>
          <p><strong>Type:</strong> {registration.participationType}</p>

          <div className="dashboard-button-group">
            <button
              onClick={() => navigate('/register', { state: { val: registration } })}
              className="dashboard-button"
            >
              Update Registration
            </button>

            <button onClick={handleDelete} className="dashboard-button danger">
              Delete Registration
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>You haven't registered for an event yet.</p>
          <button onClick={() => navigate('/register')} className="dashboard-button">
            Register Now
          </button>
        </div>
      )}

      {/*  Logout button */}
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
