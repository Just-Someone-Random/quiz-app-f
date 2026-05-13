const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Quiz = require('./models/Quiz');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect inside each request instead of at startup
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

app.get('/api/questions', async (req, res) => {
  try {
    await connectDB();
    const questions = await Quiz.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    await connectDB();
    const question = new Quiz(req.body);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/questions', async (req, res) => {
  try {
    await connectDB();
    await Quiz.deleteMany();
    res.json({ message: 'Cleared!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
