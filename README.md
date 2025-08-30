# 🎮 NexusHub - Gaming & Social Platform

A modern, full-stack gaming and social platform built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

### 🎮 Gaming Features
- **Video Streaming & Upload**: Upload and stream gaming content
- **Game Integration**: Embed and play browser games
- **Social Gaming**: Connect with other gamers

### 🛒 E-commerce
- **Gaming Store**: Browse and purchase gaming products
- **Shopping Cart**: Add, manage, and checkout items
- **Payment Integration**: Stripe payment processing

### 👥 Social Features
- **User Profiles**: Customizable gaming profiles
- **Content Sharing**: Share posts, videos, and achievements
- **Community**: Follow other users and build communities

### 🎛️ Admin Panel
- **User Management**: Manage users, roles, and permissions
- **Content Moderation**: Review and moderate user content
- **Analytics Dashboard**: Platform statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for forms
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** database
- **Mongoose** ODM
- **JWT** authentication
- **Socket.io** for real-time features
- **Stripe** payment processing
- **Cloudinary** for media uploads

### DevOps
- **Docker** containerization
- **Nginx** reverse proxy
- **SSL** certificates
- **Vercel** deployment ready

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or cloud)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexushub
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
```

### Project Structure
```
nexushub/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # CSS styles
│   └── public/            # Static assets
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── services/    # Business logic
│   │   └── config/      # Configuration
│   └── uploads/          # File uploads
└── infrastructure/        # Docker & deployment
```

## 🧪 Testing

### Demo Accounts
- **Regular User**: `demo@nexushub.com` / `demo123`
- **Admin User**: `admin@nexushub.com` / `admin123`

### Test Features
1. **Authentication**: Login/Register functionality
2. **Shopping Cart**: Add products, manage quantities
3. **Admin Panel**: User management, content moderation
4. **Video System**: Upload and play videos
5. **Social Features**: Posts, comments, following

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📱 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get video by ID

### Users
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/nexushub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nexushub/discussions)
- **Email**: support@nexushub.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Media management

---

Made with ❤️ by the NexusHub Team
