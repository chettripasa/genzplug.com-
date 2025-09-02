const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Health check successful'
  });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
