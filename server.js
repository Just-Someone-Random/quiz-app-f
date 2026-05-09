const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Quiz = require('./models/Quiz');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.log('❌ Full error:', err.message));
  
// Get all questions
app.get('/api/questions', async (req, res) => {
  const questions = await Quiz.find();
  res.json(questions);
});

// Save a new question
app.post('/api/questions', async (req, res) => {
  const question = new Quiz(req.body);
  await question.save();
  res.json(question);
});

// Delete all questions (reset)
app.delete('/api/questions', async (req, res) => {
  await Quiz.deleteMany();
  res.json({ message: 'Cleared!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));