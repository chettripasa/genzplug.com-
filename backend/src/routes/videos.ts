import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo
} from '../controllers/videoController';
import { body } from 'express-validator';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'videos', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Validation middleware
const validateVideoUpload = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('category').isIn(['gaming', 'tutorial', 'entertainment', 'education', 'other']).withMessage('Invalid category'),
  body('tags').optional().isString().withMessage('Tags must be a string')
];

const validateVideoUpdate = [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('category').optional().isIn(['gaming', 'tutorial', 'entertainment', 'education', 'other']).withMessage('Invalid category'),
  body('tags').optional().isString().withMessage('Tags must be a string'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
];

// Routes
router.post('/upload', auth, upload.single('video'), validateVideoUpload, uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', auth, validateVideoUpdate, updateVideo);
router.delete('/:id', auth, deleteVideo);
router.post('/:id/like', auth, likeVideo);

export default router;
