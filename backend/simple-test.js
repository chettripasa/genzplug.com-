const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/health') {
    res.end(JSON.stringify({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'Health check successful'
    }));
  } else {
    res.end(JSON.stringify({ message: 'Simple test server is running!' }));
  }
});

const PORT = 3002;

server.listen(PORT, 'localhost', () => {
  console.log(`Simple test server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
