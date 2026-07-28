const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '.')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FORGE Backend is loaded successfully!' });
});

app.post('/api/compile', (req, res) => {
  const { code } = req.body;

  exec('pros --version', (error, stdout, stderr) => {
    if (error) {
      console.error(`PROS Error: ${error.message}`);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        details: stderr 
      });
    }

    res.json({
      success: true,
      message: 'PROS CLI is working!',
      prosVersion: stdout.trim()
    });
  });
});

app.listen(PORT, () => {
  console.log(`FORGE Server is running on port ${PORT}`);
});