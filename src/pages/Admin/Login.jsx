import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import logo from "/images/file_00000000ac1471f5b6bc76d30b671d9d.png";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-gray-100"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="SAMTECHKE Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            SAMTECH<span className="text-primary">KE</span>
          </h1>
          <p className="text-gray-500 mt-2">Admin Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-primary" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none transition"
              placeholder="admin@samtechke.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <FaLock className="text-primary" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Secret Access Hint - Only visible to those who know */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            Secure access only
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;