import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import FloatingWhatsApp from './components/Layout/FloatingWhatsApp';
import FloatingInstall from './components/Layout/FloatingInstall';

// Public Pages
import Home from './pages/Public/Home';
import Services from './pages/Public/Services';
import Gallery from './pages/Public/Gallery';
import Testimonials from './pages/Public/Testimonials';
import Contact from './pages/Public/Contact';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ManageProjects from './pages/Admin/ManageProjects';
import ManageServices from './pages/Admin/ManageServices';
import ManageTestimonials from './pages/Admin/ManageTestimonials';
import Messages from './pages/Admin/Messages';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Component to handle secret admin access (works on mobile + desktop)
const SecretAdminHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Desktop: Type 'admin' keys
    let keySequence = [];
    const keyCode = ['a', 'd', 'm', 'i', 'n'];
    
    const handleKeyPress = (e) => {
      // Safety check - ignore if no key or if it's not a letter
      if (!e || !e.key || e.key.length > 1) return;
      
      const lowerKey = e.key.toLowerCase();
      keySequence.push(lowerKey);
      if (keySequence.length > keyCode.length) {
        keySequence.shift();
      }
      if (JSON.stringify(keySequence) === JSON.stringify(keyCode)) {
        navigate('/admin/login');
        keySequence = [];
      }
    };
    
    // Mobile: Tap footer logo 5 times
    let tapCount = 0;
    let tapTimer;
    
    const handleTap = (e) => {
      // Safety check
      if (!e || !e.target) return;
      
      const isFooter = e.target.closest?.('footer');
      const isLogo = e.target.closest?.('a')?.href?.includes('/') || e.target.closest?.('img');
      
      if (isFooter || isLogo) {
        tapCount++;
        
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          tapCount = 0;
        }, 1000);
        
        if (tapCount === 5) {
          navigate('/admin/login');
          tapCount = 0;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleTap);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleTap);
    };
  }, [navigate]);
  
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Toaster position="top-right" />
          <SecretAdminHandler />
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              } />
              <Route path="/services" element={
                <>
                  <Navbar />
                  <Services />
                  <Footer />
                </>
              } />
              <Route path="/gallery" element={
                <>
                  <Navbar />
                  <Gallery />
                  <Footer />
                </>
              } />
              <Route path="/testimonials" element={
                <>
                  <Navbar />
                  <Testimonials />
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute><ManageServices /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><ManageTestimonials /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            </Routes>
            <FloatingWhatsApp />
            <FloatingInstall />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;