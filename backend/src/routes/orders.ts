import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Orders list endpoint - to be implemented' });
});

export default router;
