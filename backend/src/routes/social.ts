import express from 'express';

const router = express.Router();

router.get('/feed', (req, res) => {
  res.json({ message: 'Social feed endpoint - to be implemented' });
});

export default router;
