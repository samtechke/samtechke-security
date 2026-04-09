import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCamera, FiSettings, FiMessageSquare, FiStar, FiLogOut, FiMenu, FiX,
  FiMail, FiTrendingUp, FiBell
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getCountFromServer, query, where, onSnapshot } from 'firebase/firestore';
import logo from "/images/file_00000000ac1471f5b6bc76d30b671d9d.png";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    testimonials: 0,
    messages: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Check screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch real counts from Firebase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const projectsCollection = collection(db, 'projects');
        const servicesCollection = collection(db, 'services');
        const testimonialsCollection = collection(db, 'testimonials');
        const messagesCollection = collection(db, 'messages');

        const [projectsSnapshot, servicesSnapshot, testimonialsSnapshot, messagesSnapshot] = await Promise.all([
          getCountFromServer(projectsCollection),
          getCountFromServer(servicesCollection),
          getCountFromServer(testimonialsCollection),
          getCountFromServer(messagesCollection)
        ]);

        setStats({
          projects: projectsSnapshot.data().count,
          services: servicesSnapshot.data().count,
          testimonials: testimonialsSnapshot.data().count,
          messages: messagesSnapshot.data().count
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Real-time unread messages count
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('read', '==', false));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    
    return () => unsubscribe();
  }, []);

  const statsData = [
    { title: 'Total Projects', value: stats.projects, icon: <FiCamera />, color: 'text-primary' },
    { title: 'Services', value: stats.services, icon: <FiSettings />, color: 'text-primary' },
    { title: 'Testimonials', value: stats.testimonials, icon: <FiStar />, color: 'text-primary' },
    { title: 'Messages', value: stats.messages, icon: <FiMessageSquare />, color: 'text-primary' },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome />, tab: 'dashboard' },
    { name: 'Manage Projects', path: '/admin/projects', icon: <FiCamera />, tab: 'projects' },
    { name: 'Manage Services', path: '/admin/services', icon: <FiSettings />, tab: 'services' },
    { name: 'Manage Testimonials', path: '/admin/testimonials', icon: <FiStar />, tab: 'testimonials' },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail />, tab: 'messages' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-30 w-64 bg-white/95 backdrop-blur-sm h-full shadow-xl border-r border-gray-200`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="SAMTECHKE Logo" className="h-8 w-auto" />
              <span className="text-gray-900 font-bold text-xl">
                SAMTECH<span className="text-primary">KE</span>
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setActiveTab(item.tab);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.tab 
                    ? 'bg-primary text-black shadow-md' 
                    : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 mt-4"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header with Logo and Bell Icon */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 text-2xl hover:text-primary transition"
              >
                <FiMenu />
              </button>
              <div className="flex items-center gap-2">
                <img src={logo} alt="SAMTECHKE Logo" className="h-8 w-auto" />
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome Back, Admin
                </h1>
              </div>
            </div>
            
            {/* Bell Icon with Notification Badge */}
            <Link to="/admin/messages" className="relative">
              <div className="bg-gray-100 p-2 rounded-full hover:bg-primary/20 transition cursor-pointer">
                <FiBell className="text-gray-600 text-xl" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </div>
                </div>
                <h3 className="text-gray-500">{stat.title}</h3>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/admin/projects"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition"
              >
                <span className="text-gray-700">Add New Project</span>
                <FiCamera className="text-primary" />
              </Link>
              <Link 
                to="/admin/services"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition"
              >
                <span className="text-gray-700">Add New Service</span>
                <FiSettings className="text-primary" />
              </Link>
              <Link 
                to="/admin/testimonials"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition"
              >
                <span className="text-gray-700">Add Testimonial</span>
                <FiStar className="text-primary" />
              </Link>
              <Link 
                to="/admin/messages"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary/10 transition"
              >
                <span className="text-gray-700">View Messages</span>
                <FiMail className="text-primary" />
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;