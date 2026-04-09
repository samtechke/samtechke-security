import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const projectsData = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading projects...</div>
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
            Our <span className="text-primary">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            See examples of our security installations across Kenya
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid - Light Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 border border-gray-100"
                  onClick={() => setSelectedImage(project)}
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Coming+Soon';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                    <p className="text-primary font-semibold text-sm">{project.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal - Clean Theme */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-3xl hover:text-primary transition"
            onClick={() => setSelectedImage(null)}
          >
            <FiX />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title}
              className="w-full rounded-t-lg"
            />
            <div className="bg-white p-4 rounded-b-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">{selectedImage.title}</h3>
              <p className="text-gray-600 mt-2">{selectedImage.description}</p>
              <p className="text-primary font-semibold mt-2">{selectedImage.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;