import express from 'express';

const router = express.Router();

router.post('/file', (req, res) => {
  res.json({ message: 'File upload endpoint - to be implemented' });
});

export default router;
