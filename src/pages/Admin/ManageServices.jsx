import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiArrowLeft } from 'react-icons/fi';
import { 
  FaBolt, FaVideo, FaBell, FaTools, FaShieldAlt, FaChartLine,
  FaWifi, FaDesktop, FaCloudUploadAlt, FaMicrophone, FaCamera, 
  FaMobileAlt, FaLock, FaEye, FaStream, FaYoutube, FaFacebook,
  FaCalendarAlt, FaChurch, FaBuilding
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageServices = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaBolt',
    features: ''
  });

  const iconOptions = [
    { name: 'Electric Fence', value: 'FaBolt', icon: <FaBolt /> },
    { name: 'CCTV', value: 'FaVideo', icon: <FaVideo /> },
    { name: 'Alarm', value: 'FaBell', icon: <FaBell /> },
    { name: 'Repair', value: 'FaTools', icon: <FaTools /> },
    { name: 'Access Control', value: 'FaShieldAlt', icon: <FaShieldAlt /> },
    { name: 'Consulting', value: 'FaChartLine', icon: <FaChartLine /> },
    { name: 'Live Streaming', value: 'FaStream', icon: <FaStream /> },
    { name: 'WiFi Security', value: 'FaWifi', icon: <FaWifi /> },
    { name: 'Smart Home', value: 'FaDesktop', icon: <FaDesktop /> },
    { name: 'Cloud Storage', value: 'FaCloudUploadAlt', icon: <FaCloudUploadAlt /> },
    { name: 'Audio Systems', value: 'FaMicrophone', icon: <FaMicrophone /> },
    { name: 'PTZ Cameras', value: 'FaCamera', icon: <FaCamera /> },
    { name: 'Mobile Access', value: 'FaMobileAlt', icon: <FaMobileAlt /> },
    { name: 'Secure Backup', value: 'FaLock', icon: <FaLock /> },
    { name: 'Surveillance', value: 'FaEye', icon: <FaEye /> },
    { name: 'YouTube Live', value: 'FaYoutube', icon: <FaYoutube /> },
    { name: 'Facebook Live', value: 'FaFacebook', icon: <FaFacebook /> },
    { name: 'Events', value: 'FaCalendarAlt', icon: <FaCalendarAlt /> },
    { name: 'Church Services', value: 'FaChurch', icon: <FaChurch /> },
    { name: 'Corporate', value: 'FaBuilding', icon: <FaBuilding /> },
  ];

  // Fetch services from Firebase
  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesRef);
      const servicesData = [];
      querySnapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() });
      });
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        // Update existing service
        const serviceRef = doc(db, 'services', editingService.id);
        await updateDoc(serviceRef, {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          features: formData.features,
          updatedAt: new Date().toISOString()
        });
        toast.success('Service updated successfully!');
      } else {
        // Add new service
        await addDoc(collection(db, 'services'), {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          features: formData.features,
          createdAt: new Date().toISOString()
        });
        toast.success('Service added successfully!');
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ title: '', description: '', icon: 'FaBolt', features: '' });
      fetchServices(); // Refresh list
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        toast.success('Service deleted successfully!');
        fetchServices(); // Refresh list
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error('Failed to delete service');
      }
    }
  };

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'FaBolt': return <FaBolt className="text-primary text-3xl" />;
      case 'FaVideo': return <FaVideo className="text-primary text-3xl" />;
      case 'FaBell': return <FaBell className="text-primary text-3xl" />;
      case 'FaTools': return <FaTools className="text-primary text-3xl" />;
      case 'FaShieldAlt': return <FaShieldAlt className="text-primary text-3xl" />;
      case 'FaChartLine': return <FaChartLine className="text-primary text-3xl" />;
      case 'FaStream': return <FaStream className="text-primary text-3xl" />;
      case 'FaWifi': return <FaWifi className="text-primary text-3xl" />;
      case 'FaDesktop': return <FaDesktop className="text-primary text-3xl" />;
      case 'FaCloudUploadAlt': return <FaCloudUploadAlt className="text-primary text-3xl" />;
      case 'FaMicrophone': return <FaMicrophone className="text-primary text-3xl" />;
      case 'FaCamera': return <FaCamera className="text-primary text-3xl" />;
      case 'FaMobileAlt': return <FaMobileAlt className="text-primary text-3xl" />;
      case 'FaLock': return <FaLock className="text-primary text-3xl" />;
      case 'FaEye': return <FaEye className="text-primary text-3xl" />;
      case 'FaYoutube': return <FaYoutube className="text-primary text-3xl" />;
      case 'FaFacebook': return <FaFacebook className="text-primary text-3xl" />;
      case 'FaCalendarAlt': return <FaCalendarAlt className="text-primary text-3xl" />;
      case 'FaChurch': return <FaChurch className="text-primary text-3xl" />;
      case 'FaBuilding': return <FaBuilding className="text-primary text-3xl" />;
      default: return <FaBolt className="text-primary text-3xl" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
              <FiArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ title: '', description: '', icon: 'FaBolt', features: '' });
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Service
          </button>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">No services yet. Click "Add Service" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition border border-gray-100"
              >
                <div className="mb-4">{getIconComponent(service.icon)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="mb-4">
                  <p className="text-primary text-sm font-semibold mb-1">Features:</p>
                  <p className="text-gray-500 text-sm">{service.features}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal - Add/Edit Service */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="e.g., Live Streaming Services"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="Describe the service..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    required
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full btn-primary justify-center">
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;