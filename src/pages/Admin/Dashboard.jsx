import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCamera, FiSettings, FiMessageSquare, FiStar, FiLogOut, FiMenu, FiX,
  FiMail, FiTrendingUp, FiBell, FiBarChart2, FiUsers, FiDollarSign, FiActivity,
  FiChevronRight, FiChevronDown, FiRefreshCw, FiCalendar, FiEye, FiThumbsUp
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getCountFromServer, query, where, onSnapshot, getDocs } from 'firebase/firestore';
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
        const q = query(messagesRef, where('read', '==', false));
        const snapshot = await getDocs(q);
        const messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        setRecentMessages(messages.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };
    fetchRecentMessages();
  }, [unreadCount]);

  // Fetch recent projects
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const snapshot = await getDocs(projectsRef);
        const projects = [];
        snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        setRecentProjects(projects.slice(0, 3));
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
    { title: 'Total Projects', value: stats.projects, icon: <FiCamera />, color: 'bg-blue-500', trend: '+12%', trendUp: true },
    { title: 'Services', value: stats.services, icon: <FiSettings />, color: 'bg-green-500', trend: '+5%', trendUp: true },
    { title: 'Testimonials', value: stats.testimonials, icon: <FiStar />, color: 'bg-yellow-500', trend: '+8%', trendUp: true },
    { title: 'Messages', value: stats.messages, icon: <FiMessageSquare />, color: 'bg-purple-500', trend: '+15%', trendUp: true },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome />, tab: 'dashboard' },
    { name: 'Manage Projects', path: '/admin/projects', icon: <FiCamera />, tab: 'projects' },
    { name: 'Manage Services', path: '/admin/services', icon: <FiSettings />, tab: 'services' },
    { name: 'Manage Testimonials', path: '/admin/testimonials', icon: <FiStar />, tab: 'testimonials' },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail />, tab: 'messages' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-30 w-72 bg-gradient-to-b from-gray-900 to-gray-800 h-full shadow-2xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-7 w-auto" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">SAMTECH<span className="text-primary">KE</span></span>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX />
            </button>
          </div>

          <nav className="space-y-1">
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
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
                {activeTab === item.tab && <FiChevronRight className="text-sm" />}
              </Link>
            ))}
            
            <div className="pt-6 mt-6 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 text-2xl hover:text-primary transition lg:hidden"
              >
                <FiMenu />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{greeting}, Admin!</h1>
                <p className="text-gray-500 text-sm">{currentTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
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
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <div className={`text-2xl ${stat.color.replace('bg-', 'text-')}`}>{stat.icon}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                    <FiTrendingUp className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</div>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
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
                <button className="text-gray-400 hover:text-primary transition">
                  <FiRefreshCw />
                </button>
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
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Projects</h2>
              <div className="space-y-4">
                {recentProjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No projects yet</p>
                ) : (
                  recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium text-sm">{project.title}</p>
                        <p className="text-gray-400 text-xs">{project.date}</p>
                      </div>
                      <Link to="/admin/projects" className="text-gray-400 hover:text-primary">
                        <FiEye />
                      </Link>
                    </div>
                  ))
                )}
              </div>
              <Link to="/admin/projects" className="mt-6 block text-center text-primary text-sm hover:underline">
                View All Projects →
              </Link>
            </motion.div>
          </div>

          {/* Quick Actions - Enhanced */}
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
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                    {unreadCount}
                  </span>
                )}
                <FiChevronRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <FiUsers className="text-2xl text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">500+</p>
              <p className="text-gray-500 text-sm">Happy Clients</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <FiThumbsUp className="text-2xl text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">98%</p>
              <p className="text-gray-500 text-sm">Satisfaction</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <FiActivity className="text-2xl text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">24/7</p>
              <p className="text-gray-500 text-sm">Support</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <FiDollarSign className="text-2xl text-primary mx-auto mb-2" />
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