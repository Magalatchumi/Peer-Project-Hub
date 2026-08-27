import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}