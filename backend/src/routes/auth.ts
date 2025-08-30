import express from 'express';

const router = express.Router();

// Basic auth routes - you can expand these later
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - to be implemented' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' });
});

export default router;
