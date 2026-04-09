import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FloatingInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide button if app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the prompt or if event didn't fire
      alert('To install, tap the browser menu (3 dots) and select "Install app" or "Add to Home Screen".');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted install');
      setShowInstall(false);
    } else {
      console.log('User dismissed install');
    }
    // Clear the deferred prompt (it can only be used once)
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

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