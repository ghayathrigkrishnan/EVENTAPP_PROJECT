require('dotenv').config();
const express = require("express");
const cors = require("cors");

const { sendDeletionEmail, sendAdminNotification } = require('./mailer');

const participants =
require("./model/participant"); 
require("./db");

const User = require('./model/userModel');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const ActivityLog = require('./model/ActivityLog');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello");
});

// === OLD ROUTES (ADMIN) ===

app.post('/', async (req, res) => {
  try {
    await participants(req.body).save();
    res.send("SUCCESFULLY SUBMITTED");
  } catch (error) {
    console.error("Error saving student:", error);
    res.status(500).send("Error saving data");  
  }
});

app.get('/view', async (req, res) => {
  try {
    const data = await participants.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const deletedParticipant = await participants.findByIdAndDelete(req.params.id);

    if (deletedParticipant) {
      await sendDeletionEmail(
        deletedParticipant.email,
        deletedParticipant.name,
        deletedParticipant.event
      );
      res.send("Student deleted and email sent");
    } else {
      res.status(404).send("Participant not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting student");
  }
});

app.put("/:id", async (req, res) => {
  try {
    await participants.findByIdAndUpdate(req.params.id, req.body);
    res.send("student data updated");
  } catch (error) {
    res.send(error);
  }
});

app.post('/admin-login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, message: "Authenticated" });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// === NEW ROUTES (LOGIN SYSTEM) ===

// Register new user
app.post('/register-user', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, 'jwtSecretKey', { expiresIn: '1h' });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// === PROTECTED DASHBOARD ROUTES ===

// Fetch user's own registration
app.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const registration = await participants.findOne({ userId });
  res.json(registration);
});

// Register new event (for logged-in user)
app.post('/register', authMiddleware, async (req, res) => {
  try {
    const newEntry = new participants({ ...req.body, userId: req.user.id });
    await newEntry.save();
    await ActivityLog.create({
  userId: req.user.id,
  email: req.body.email,
  action: "REGISTERED"
});

    res.send("Registration submitted successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving registration");
  }
});

// Update registration
app.put('/me/update', authMiddleware, async (req, res) => {
  try {
    const updated = await participants.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true } // returns updated doc if needed
    );

    if (!updated) {
      return res.status(404).json({ message: "No registration found to update" });
    }

    await ActivityLog.create({
      userId: req.user.id,
      email: req.body.email,
      action: "UPDATED"
    });

    // Send email BEFORE res.send()
    await sendAdminNotification(
      "Participant Updated Registration",
      `
        <p><strong>${req.body.name}</strong> (${req.body.email}) updated their registration to <strong>${req.body.event}</strong>.</p>
        <p>Type: ${req.body.participationType}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    );

    res.send("Registration updated");
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Error updating registration");
  }
});


// Delete registration
app.delete('/me/delete', authMiddleware, async (req, res) => {
  try {
    const deleted = await participants.findOneAndDelete({ userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "No registration found to delete" });
    }

    await ActivityLog.create({
      userId: req.user.id,
      email: deleted.email,
      action: "DELETED"
    });

    await sendAdminNotification(
      "Participant Deleted Registration",
      `
        <p><strong>${deleted.name}</strong> (${deleted.email}) has <strong>deleted</strong> their registration for <strong>${deleted.event}</strong>.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    );

    res.send("Registration deleted");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Error deleting registration");
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

app.get('/logs', async (req, res) => {
  const password = req.headers.authorization;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).populate('userId');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

