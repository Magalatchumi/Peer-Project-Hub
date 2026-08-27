import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ProjectDetails from './pages/ProjectDetails'
import CreateProject from './pages/CreateProject'
import EditProject from './pages/EditProject'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Technologies from './pages/Technologies'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/technologies" element={<Technologies />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile/:id" element={<Profile />} />

      {/* Protected Routes (for now, same as public) */}
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/edit-project/:id" element={<EditProject />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}