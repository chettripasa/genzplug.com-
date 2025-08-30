# NexusHub Frontend

The frontend application for NexusHub, an all-in-one platform for gaming, social media, e-commerce, and video content.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom design system
- **React Router** for client-side routing
- **React Hook Form** for form handling and validation
- **React Query** for server state management
- **Socket.IO** for real-time features
- **Framer Motion** for animations
- **Lucide React** for beautiful icons
- **Responsive design** for all devices

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation component
│   ├── Footer.tsx      # Footer component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   ├── AuthContext.tsx # Authentication state
│   ├── CartContext.tsx # Shopping cart state
│   ├── SocketContext.tsx # WebSocket connections
│   └── NotificationContext.tsx # Notifications
├── pages/               # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── DashboardPage.tsx # User dashboard
│   └── ...             # Other pages
├── services/            # API services
│   └── api.ts          # HTTP client and endpoints
├── types/               # TypeScript type definitions
│   └── index.ts        # Main types file
├── styles/              # Global styles
│   └── index.css       # Tailwind and custom CSS
├── App.tsx              # Main app component
└── main.tsx            # Application entry point
```

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **State Management**: React Query + Context API
- **Forms**: React Hook Form
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Vite Configuration
The Vite configuration includes:
- React plugin
- Development server with proxy to backend
- Build optimization
- Source maps configuration

### Tailwind Configuration
Custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Component utilities
- Responsive breakpoints

### TypeScript Configuration
Strict TypeScript configuration with:
- Modern ES2020 target
- Strict type checking
- Path aliases
- JSX support

## 🌐 API Integration

The frontend integrates with the NexusHub backend through:
- **RESTful API** endpoints for CRUD operations
- **WebSocket connections** for real-time features
- **JWT authentication** for secure requests
- **File upload** support for images and videos

### API Services
- `authAPI` - Authentication and user management
- `productsAPI` - E-commerce product operations
- `videosAPI` - Video content management
- `socialAPI` - Social media features
- `gamingAPI` - Gaming portal functionality
- `ordersAPI` - Order management
- `messagesAPI` - Chat and messaging
- `notificationsAPI` - User notifications
- `uploadAPI` - File upload handling

## 🔐 Authentication

The authentication system includes:
- User registration and login
- JWT token management
- Protected routes
- Role-based access control
- Social login support (Google, Twitter)

## 🛒 Shopping Cart

Features a comprehensive shopping cart with:
- Add/remove products
- Quantity management
- Persistent storage
- Real-time updates
- Checkout integration

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎨 Design System

Custom design system built with Tailwind CSS:
- Consistent color palette
- Typography scale
- Component variants
- Animation utilities
- Dark mode support (planned)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t nexushub-frontend .
docker run -p 80:80 nexushub-frontend
```

### Environment Variables for Production
- `VITE_API_URL` - Production API endpoint
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `VITE_APP_ENV` - Environment identifier

## 🔍 Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component names

### State Management
- Use React Query for server state
- Use Context API for global client state
- Keep component state local when possible
- Implement proper loading and error states

### Performance
- Implement code splitting
- Use React.memo for expensive components
- Optimize bundle size
- Implement lazy loading for routes

## 🧪 Testing

Testing setup includes:
- Unit testing with Jest
- Component testing with React Testing Library
- E2E testing with Playwright (planned)
- Test coverage reporting

## 📚 Documentation

- [Component API Reference](./docs/components.md)
- [State Management Guide](./docs/state.md)
- [API Integration Guide](./docs/api.md)
- [Styling Guide](./docs/styling.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Join our community Discord

## 🔮 Roadmap

- [ ] Dark mode support
- [ ] Advanced search functionality
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] PWA capabilities
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Internationalization (i18n)
