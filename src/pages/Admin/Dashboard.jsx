import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiCamera, FiSettings, FiMessageSquare, FiStar, FiLogOut, FiMenu, FiX,
  FiMail, FiTrendingUp, FiBell, FiBarChart2, FiUsers, FiDollarSign, FiActivity,
  FiChevronRight, FiRefreshCw, FiCalendar, FiEye, FiThumbsUp, FiUser,
  FiGrid, FiFolder, FiHeart, FiClock, FiAward, FiTarget
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getCountFromServer, query, where, onSnapshot, getDocs, orderBy, limit } from 'firebase/firestore';
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
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const collections = ['projects', 'services', 'testimonials', 'messages'];
        const results = await Promise.all(
          collections.map(name => getCountFromServer(collection(db, name)))
        );
        
        setStats({
          projects: results[0].data().count,
          services: results[1].data().count,
          testimonials: results[2].data().count,
          messages: results[3].data().count
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Real-time unread messages
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('read', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => setUnreadCount(snapshot.size));
    return () => unsubscribe();
  }, []);

  // Fetch recent messages
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        setRecentMessages(messages);
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };
    fetchRecentMessages();
  }, []);

  // Fetch recent projects
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('date', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const projects = [];
        snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        setRecentProjects(projects);
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      }
    };
    fetchRecentProjects();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const statsData = [
    { title: 'Total Projects', value: stats.projects, icon: <FiCamera />, color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: '+12%', trendUp: true },
    { title: 'Services', value: stats.services, icon: <FiSettings />, color: 'from-green-500 to-green-600', iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: '+5%', trendUp: true },
    { title: 'Testimonials', value: stats.testimonials, icon: <FiStar />, color: 'from-yellow-500 to-yellow-600', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: '+8%', trendUp: true },
    { title: 'Messages', value: stats.messages, icon: <FiMessageSquare />, color: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', trend: '+15%', trendUp: true },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome />, tab: 'dashboard' },
    { name: 'Projects', path: '/admin/projects', icon: <FiCamera />, tab: 'projects' },
    { name: 'Services', path: '/admin/services', icon: <FiSettings />, tab: 'services' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <FiStar />, tab: 'testimonials' },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail />, tab: 'messages' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:relative z-30 w-80 bg-gradient-to-b from-slate-900 to-slate-800 h-full shadow-2xl overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">SAMTECH<span className="text-primary">KE</span></span>
                <p className="text-gray-400 text-xs">Admin Control Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition">
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-2 border-primary/30">
              <span className="text-primary font-bold text-2xl">A</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Admin User</h3>
              <p className="text-gray-400 text-xs">Super Administrator</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-500 text-xs">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => {
                setActiveTab(item.tab);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.tab 
                  ? 'bg-primary text-black shadow-lg' 
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 font-medium">{item.name}</span>
              {item.name === 'Messages' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center animate-pulse">
                  {unreadCount}
                </span>
              )}
              {activeTab === item.tab && <FiChevronRight className="text-sm" />}
            </Link>
          ))}
          
          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <FiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <p className="text-gray-500 text-xs text-center">v2.0.0 | © 2024</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 text-2xl hover:text-primary transition lg:hidden"
              >
                <FiMenu />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {greeting}, Admin!
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                  <FiCalendar size={14} />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <FiClock size={14} className="ml-2" />
                  <span>{currentTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/admin/messages" className="relative">
                <div className="bg-gray-100 p-2.5 rounded-full hover:bg-primary/20 transition cursor-pointer">
                  <FiBell className="text-gray-600 text-xl" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-3 border-l border-gray-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-black font-bold text-lg"><strong>S</strong></span>
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition">Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition">Account Security</button>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-yellow-50/50 to-primary/5 rounded-2xl p-6 mb-8 border border-primary/20"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard!</h2>
                <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-primary text-black px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm">
                  + Add Project
                </button>
                <button className="border border-primary text-primary px-5 py-2 rounded-lg font-medium hover:bg-primary/10 transition">
                  View Report
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition`}>
                    <div className={`text-2xl ${stat.iconColor}`}>{stat.icon}</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                    <FiTrendingUp className="text-xs text-green-500" />
                    <span className="text-xs font-semibold text-green-600">{stat.trend}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</div>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-yellow-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                <Link to="/admin/messages" className="text-primary text-sm hover:underline flex items-center gap-1">
                  View All <FiChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {recentMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  recentMessages.map((msg, idx) => (
                    <div key={msg.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{msg.name}</p>
                        <p className="text-gray-500 text-sm">{msg.message?.substring(0, 60)}...</p>
                      </div>
                      <Link to="/admin/messages" className="text-primary text-sm hover:underline">View</Link>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
                <Link to="/admin/projects" className="text-primary text-sm hover:underline flex items-center gap-1">
                  View All <FiChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {recentProjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No projects yet</p>
                ) : (
                  recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium text-sm">{project.title}</p>
                        <p className="text-gray-400 text-xs">{project.date}</p>
                      </div>
                      <Link to="/admin/projects" className="text-gray-400 hover:text-primary transition">
                        <FiEye />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary/5 via-white to-primary/5 rounded-2xl p-6 shadow-lg border border-primary/10"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/admin/projects"
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <FiCamera className="text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Add Project</span>
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
              </Link>
              <Link 
                to="/admin/services"
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <FiSettings className="text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Add Service</span>
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
              </Link>
              <Link 
                to="/admin/testimonials"
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <FiStar className="text-yellow-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Add Review</span>
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
              </Link>
              <Link 
                to="/admin/messages"
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                    <FiMail className="text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">View Messages</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiUsers className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-800"></p>
              <p className="text-gray-500 text-sm">Happy Clients</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiThumbsUp className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-800">98%</p>
              <p className="text-gray-500 text-sm">Satisfaction</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiActivity className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-800">24/7</p>
              <p className="text-gray-500 text-sm">Support</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiAward className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-800">Best</p>
              <p className="text-gray-500 text-sm">Prices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;