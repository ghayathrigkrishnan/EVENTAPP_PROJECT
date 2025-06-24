import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import './Home.css';
import '../index.css';

const events = [
  {
    id: 1,
    title: "Tech Conference 2025",
    date: "June 20, 2025",
    description: "An immersive experience into technology trends.",
    image: "/tech conference.jpg"
  },
  {
    id: 2,
    title: "Tech Workshop",
    date: "June 20, 2025",
    description: "Hands-on experience with latest tools.",
    image: "/tech workshop.jpg"
  },
  {
    id: 3,
    title: "Exhibition",
    date: "June 20, 2025",
    description: "Discover cutting-edge innovations.",
    image: "/exhibition.jpg"
  },
  {
    id: 4,
    title: "Fest 2025",
    date: "June 20, 2025",
    description: "Celebrate technology with fun and festivity.",
    image: "/fest.jpg"
  },
  {
    id: 5,
    title: "Coding Bootcamp",
    date: "June 20, 2025",
    description: "Sharpen your coding skills.",
    image: "/coding bootcamp.jpg"
  },
  {
    id: 6,
    title: "Music Fest",
    date: "June 20, 2025",
    description: "Vibe to live music and artistic performances.",
    image: "/music fest.jpg"
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="starry-background"></div>

      <div className="home-content">
        <h1 className="home-title">VIMALA COLLEGE</h1>
        <h2 className="home-subtitle">presents</h2>
        <h1 className="home-event">RITI 10.0</h1>
        <p className="home-tagline">Where innovation meets celebration ✨</p>
      </div>

      <Grid container spacing={3} justifyContent="center" className="card-container">
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card className="event-card">
              <CardMedia
                component="img"
                height="180"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="h6" className="event-title">
                  {event.title}
                </Typography>
                <Typography variant="body2" className="event-date">
                  {event.date}
                </Typography>
                <Typography variant="body2" className="event-description">
                  {event.description}
                </Typography>
                <Button
                  className="read-more-button"
                  variant="contained"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
