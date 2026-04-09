import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Listen for install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show install prompt
    deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install');
      setShowInstall(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <button
          onClick={handleInstall}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          <FiDownload size={24} />
          <span className="hidden md:inline text-sm font-semibold">Install App</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingInstall;