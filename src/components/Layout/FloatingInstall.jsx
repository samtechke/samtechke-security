import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FloatingInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(true); // Always show

  useEffect(() => {
    // Listen for install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    // Hide only if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      // Manual install instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('Tap Share button → Add to Home Screen');
      } else {
        alert('Click Chrome menu (3 dots) → Install app');
      }
    }
  };

  // Always show the button
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <button
        onClick={handleInstall}
        className="bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center gap-2"
      >
        <FiDownload size={20} />
        <span className="text-sm font-semibold">Install App</span>
      </button>
    </motion.div>
  );
};

export default FloatingInstall;