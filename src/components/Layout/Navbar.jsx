import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
import logo from '../../pages/Public/images/file_00000000ac1471f5b6bc76d30b671d9d.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    // Check if already installed (iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !window.navigator.standalone) {
      setShowInstallBtn(true);
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      });
    } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      alert('Tap Share button then "Add to Home Screen"');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SAMTECHKE Logo" className="h-10 w-auto" />
            <span className="text-gray-900 font-bold text-xl">
              SAMTECH<span className="text-primary">KE</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Install App Button - Desktop */}
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
              >
                <FiDownload /> Install App
              </button>
            )}
            
            {/* Dashboard & Logout - ONLY shows when logged in */}
            {user && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            <a href="tel:+254729289847" className="btn-primary text-sm py-2">
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900 text-2xl"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Install App Button - Mobile */}
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mt-2"
              >
                <FiDownload /> Install App
              </button>
            )}
            
            {user && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-red-500 hover:text-red-600 transition-colors w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
            <a href="tel:+254729289847" className="btn-primary block text-center mt-4">
              Call Now
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;