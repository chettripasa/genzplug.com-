# NexusHub Full Stack Application

A comprehensive full-stack application featuring e-commerce, social networking, video sharing, and gaming platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both servers (backend + frontend):**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
nexushub/
├── backend/                 # Express.js + TypeScript API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── .env                # Backend environment variables
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── stores/        # State management
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── .env               # Frontend environment variables
└── package.json           # Root package.json with scripts
```

## 🛠️ Available Scripts

### Root Level Commands
```bash
npm run dev              # Start both backend and frontend
npm run dev:backend     # Start only backend server
npm run dev:frontend    # Start only frontend server
npm run build           # Build both backend and frontend
npm run install:all     # Install dependencies for all packages
```

### Backend Commands (from backend/ directory)
```bash
npm run dev             # Start development server with nodemon
npm run build           # Build TypeScript to JavaScript
npm run start           # Start production server
npm run test            # Run tests
```

### Frontend Commands (from frontend/ directory)
```bash
npm run dev             # Start Vite development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Users
- `GET /api/users/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get video by ID

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create order (protected)

### Social
- `GET /api/social/posts` - Get social posts
- `POST /api/social/posts` - Create post (protected)

### Gaming
- `GET /api/gaming/games` - Get available games
- `POST /api/gaming/play` - Start game session

## 🎯 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Login/Register with JWT
- **E-commerce**: Product browsing, cart, checkout
- **Video Platform**: Video upload, playback, comments
- **Social Network**: Posts, comments, user profiles
- **Gaming Portal**: Interactive games and leaderboards
- **Admin Dashboard**: User management, content moderation
- **Real-time Updates**: WebSocket integration

### Backend Features
- **RESTful API**: Express.js with TypeScript
- **Authentication**: JWT-based auth with middleware
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer for file handling
- **Security**: Helmet, CORS, rate limiting
- **WebSockets**: Socket.io for real-time features
- **Payment Integration**: Stripe payment processing
- **Email Service**: Nodemailer for notifications

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Vercel, Heroku, etc.)

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy the `dist/` folder to your hosting platform

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in the respective `.env` file
   - Kill existing processes using the port

2. **MongoDB connection failed**
   - Check your MongoDB URI in backend `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas

3. **Frontend not connecting to backend**
   - Verify `VITE_API_URL` in frontend `.env`
   - Check CORS settings in backend

4. **TypeScript compilation errors**
   - Run `npm run build` to see detailed errors
   - Check for missing dependencies

## 📝 Development Notes

- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- MongoDB connection is optional for development
- All API endpoints are prefixed with `/api`
- WebSocket server runs on the same port as the backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**
