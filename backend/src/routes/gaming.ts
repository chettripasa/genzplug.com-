import express from 'express';

const router = express.Router();

router.get('/games', (req, res) => {
  res.json({ message: 'Gaming endpoint - to be implemented' });
});

export default router;
