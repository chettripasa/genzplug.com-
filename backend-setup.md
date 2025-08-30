# Backend Setup Guide for NexusHub

## Quick Start

### 1. Create Backend Directory
```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express cors dotenv bcryptjs jsonwebtoken mongoose
npm install --save-dev nodemon
```

### 3. Basic Server Structure

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NexusHub API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Environment Variables
Create `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexushub
JWT_SECRET=your_jwt_secret_here
```

### 5. Authentication Routes
Create `routes/auth.js`:
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

### 6. User Model
Create `models/User.js`:
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### 7. Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 8. Start the Backend
```bash
npm run dev
```

## Frontend Integration

When your backend is ready, update the AuthContext:

```typescript
// In frontend/src/contexts/AuthContext.tsx
// Replace this line:
const currentAuthAPI = mockAuthAPI;

// With this:
const currentAuthAPI = authAPI;
```

## Testing the Backend

1. **Start MongoDB** (if using local database)
2. **Start the backend**: `npm run dev`
3. **Test the API**: Visit `http://localhost:5000/api/health`
4. **Test registration**: POST to `http://localhost:5000/api/auth/register`
5. **Test login**: POST to `http://localhost:5000/api/auth/login`

## Next Steps

- Add more routes (products, videos, posts, admin)
- Implement middleware for authentication
- Add validation and error handling
- Set up database connections
- Add file upload functionality
- Implement real-time features with Socket.io
