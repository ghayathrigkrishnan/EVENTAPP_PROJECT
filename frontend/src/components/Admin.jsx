import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState([]);

  const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/admin-login', { password });
    
    if (res.data.success) {
      setIsAuthenticated(true);
      fetchParticipants();
    }
  } catch (error) {
    alert("Incorrect password");
  }
};


  const fetchParticipants = async () => {
  try {
    const res = await axios.get('http://localhost:3000/view');
    console.log("Participants fetched from backend:", res.data); // 💥 ADD THIS
    setParticipants(res.data); // Make sure this is an array
  } catch (err) {
    console.error("Failed to fetch participants:", err);
  }
};

   const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/${id}`);
      fetchParticipants(); // refresh table
    } catch (err) {
      console.error("Failed to delete participant:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
        {!isAuthenticated ? (
          <>
            <Typography variant="h5" align="center" gutterBottom className='text' >
              Admin Login
            </Typography>
            <TextField
              fullWidth
              label="Enter Admin Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              className='btn'
              onClick={handleLogin}
              sx={{ backgroundColor: '#ff9800', mt: 2, '&:hover': { backgroundColor: '#e68900' } }}
            >
              Enter
            </Button>
          </>
        ) : (
            <>
            <Typography variant="h5" align="center" gutterBottom color='#8EB69B'>
              Welcome, Admin!
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography align="center" color="textSecondary">
              {/* (Your admin dashboard will appear here) */}
            </Typography>
            {/* Later: Show event registrations here */}

              {/* Table of participants */}
            <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>Name</TableCell>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>Email</TableCell>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>College</TableCell>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>Event</TableCell>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>Type</TableCell>
                    <TableCell className='text' style={{ color: '#8EB69B' }}>Team Size</TableCell>
                     <TableCell className='text'>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map((participant, index) => (
                    <TableRow key={index}>
                      <TableCell className='text'>{participant.name}</TableCell>
                      <TableCell className='text'>{participant.email}</TableCell>
                      <TableCell className='text'>{participant.college}</TableCell>
                      <TableCell className='text'>{participant.event}</TableCell>
                      <TableCell className='text'>{participant.participationType}</TableCell>
                      <TableCell className='text'>{participant.teamSize}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(participant._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Admin;
