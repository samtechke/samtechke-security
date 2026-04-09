import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBolt, FaVideo, FaBell, FaTools, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const servicesData = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() });
        });
        
        setServicesList(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'FaBolt': return <FaBolt className="text-primary text-5xl" />;
      case 'FaVideo': return <FaVideo className="text-primary text-5xl" />;
      case 'FaBell': return <FaBell className="text-primary text-5xl" />;
      case 'FaTools': return <FaTools className="text-primary text-5xl" />;
      case 'FaShieldAlt': return <FaShieldAlt className="text-primary text-5xl" />;
      case 'FaChartLine': return <FaChartLine className="text-primary text-5xl" />;
      default: return <FaBolt className="text-primary text-5xl" />;
    }
  };

  // Default services in case Firebase is empty
  const defaultServices = [
    {
      icon: "FaBolt",
      title: "Electric Fence Installation",
      description: "High-voltage electric fence systems that deter intruders effectively. We use quality energizers and poles for maximum security.",
      features: "24/7 monitoring, Weather resistant, Low maintenance"
    },
    {
      icon: "FaVideo",
      title: "CCTV Installation",
      description: "High-definition cameras with night vision and remote access. Monitor your property from anywhere in the world.",
      features: "4K resolution, Motion detection, Cloud storage"
    },
    {
      icon: "FaBell",
      title: "Alarm Systems",
      description: "Instant alert systems that notify you immediately when intrusion is detected. Connect to security companies.",
      features: "SMS alerts, Siren activation, Police dispatch"
    },
    {
      icon: "FaTools",
      title: "Fence Repair & Maintenance",
      description: "Regular maintenance and emergency repair services for all types of security fences.",
      features: "24/7 emergency, Quality parts, Annual contracts"
    },
    {
      icon: "FaShieldAlt",
      title: "Access Control",
      description: "Modern access control systems including biometric, card, and phone-based entry systems.",
      features: "Biometric, Remote access, Visitor logs"
    },
    {
      icon: "FaChartLine",
      title: "Security Consulting",
      description: "Professional security assessment and customized security solutions for your property.",
      features: "Risk assessment, Custom design, Budget planning"
    }
  ];

  const displayServices = servicesList.length > 0 ? servicesList : defaultServices;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Light Theme */}
      <section className="bg-gradient-to-r from-primary/10 via-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            Our <span className="text-primary">Security Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Comprehensive security solutions tailored for Kenyan homes and businesses
          </motion.p>
        </div>
      </section>

      {/* Services Grid - Light Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:scale-105 transition duration-300 border border-gray-100"
              >
                <div className="mb-4">
                  {service.icon ? getIconComponent(service.icon) : getIconComponent(defaultServices[index]?.icon)}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {(service.features ? service.features.split(',') : defaultServices[index]?.features.split(',')).map((feature, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                      <span className="text-primary font-bold">✓</span> {feature.trim()}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Yellow Theme */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Need a Custom Solution?</h2>
          <p className="text-black/70 mb-6">Contact us for a free consultation and quote</p>
          <a href="https://wa.me/254729289847" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
            Get Free Quote
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;