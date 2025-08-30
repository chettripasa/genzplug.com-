import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardPage from './pages/DashboardPage'
import ShopPage from './pages/ShopPage'
import VideoPage from './pages/VideoPage'
import SocialPage from './pages/SocialPage'
import GamingPage from './pages/GamingPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="videos" element={<VideoPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="gaming" element={<GamingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
