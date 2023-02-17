import express from 'express';

const router = express.Router();

// API routes
router.get('/', (req, res) => {
  res.send('Routes are working');
});

export default router;