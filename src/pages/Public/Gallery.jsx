import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiImage, FiPlay, FiPause } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [previewIndexes, setPreviewIndexes] = useState({});
  const autoPlayInterval = useRef(null);
  const previewIntervals = useRef({});

  // Helper functions
  const getProjectImages = (project) => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    return project.image ? [project.image] : [];
  };

  // Start preview slideshow for a single project
  const startPreviewSlideshow = (projectId, images) => {
    // Clear existing interval
    if (previewIntervals.current[projectId]) {
      clearInterval(previewIntervals.current[projectId]);
    }
    
    // Only start if more than 1 image
    if (images.length <= 1) return;
    
    // Start new interval
    previewIntervals.current[projectId] = setInterval(() => {
      setPreviewIndexes(prev => {
        const currentIndex = prev[projectId] || 0;
        const nextIndex = (currentIndex + 1) % images.length;
        return {
          ...prev,
          [projectId]: nextIndex
        };
      });
    }, 2000); // Change every 2 seconds
  };

  // Stop preview slideshow for a project
  const stopPreviewSlideshow = (projectId) => {
    if (previewIntervals.current[projectId]) {
      clearInterval(previewIntervals.current[projectId]);
      delete previewIntervals.current[projectId];
    }
  };

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

  // Start preview slideshows for all projects after projects load
  useEffect(() => {
    if (projects.length > 0) {
      const initialIndexes = {};
      projects.forEach(project => {
        const images = getProjectImages(project);
        initialIndexes[project.id] = 0;
        
        // Start slideshow for this project
        startPreviewSlideshow(project.id, images);
      });
      setPreviewIndexes(initialIndexes);
    }
    
    // Cleanup on unmount
    return () => {
      Object.keys(previewIntervals.current).forEach(projectId => {
        stopPreviewSlideshow(projectId);
      });
    };
  }, [projects]);

  // Auto-play logic for lightbox
  useEffect(() => {
    if (isAutoPlaying && selectedProject && getProjectImages(selectedProject).length > 1) {
      autoPlayInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev + 1 >= getProjectImages(selectedProject).length ? 0 : prev + 1
        );
      }, 3000);
    } else {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    }
    
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isAutoPlaying, selectedProject]);

  const openLightbox = (project, index = 0) => {
    // Stop preview slideshow for this project when opening
    stopPreviewSlideshow(project.id);
    setSelectedProject(project);
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setIsAutoPlaying(false);
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }
    
    // Restart preview slideshow for the closed project
    if (selectedProject) {
      const images = getProjectImages(selectedProject);
      if (images.length > 1) {
        startPreviewSlideshow(selectedProject.id, images);
      }
    }
  };

  const nextImage = () => {
    if (selectedProject && getProjectImages(selectedProject).length > 1) {
      setCurrentImageIndex((prev) => 
        prev + 1 >= getProjectImages(selectedProject).length ? 0 : prev + 1
      );
      if (isAutoPlaying) {
        // Reset auto-play timer
        if (autoPlayInterval.current) {
          clearInterval(autoPlayInterval.current);
        }
        autoPlayInterval.current = setInterval(() => {
          setCurrentImageIndex((prev) => 
            prev + 1 >= getProjectImages(selectedProject).length ? 0 : prev + 1
          );
        }, 3000);
      }
    }
  };

  const prevImage = () => {
    if (selectedProject && getProjectImages(selectedProject).length > 1) {
      setCurrentImageIndex((prev) => 
        prev - 1 < 0 ? getProjectImages(selectedProject).length - 1 : prev - 1
      );
      if (isAutoPlaying) {
        // Reset auto-play timer
        if (autoPlayInterval.current) {
          clearInterval(autoPlayInterval.current);
        }
        autoPlayInterval.current = setInterval(() => {
          setCurrentImageIndex((prev) => 
            prev + 1 >= getProjectImages(selectedProject).length ? 0 : prev + 1
          );
        }, 3000);
      }
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, currentImageIndex, isAutoPlaying]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  const getProjectImage = (project) => {
    const images = getProjectImages(project);
    return images[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-gray-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900"
          >
            Our <span className="text-primary">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
          >
            See examples of our security installations across Kenya
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid with Card Slideshow */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const images = getProjectImages(project);
                const imageCount = images.length;
                const currentPreviewIndex = previewIndexes[project.id] || 0;
                const currentPreviewImage = images[currentPreviewIndex] || images[0];
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 border border-gray-100 group"
                    onClick={() => openLightbox(project, currentPreviewIndex)}
                    onMouseEnter={() => imageCount > 1 && stopPreviewSlideshow(project.id)}
                    onMouseLeave={() => imageCount > 1 && startPreviewSlideshow(project.id, images)}
                  >
                    <div className="relative overflow-hidden bg-gray-200" style={{ minHeight: '220px' }}>
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={`${project.id}-${currentPreviewIndex}`}
                          src={currentPreviewImage}
                          alt={project.title}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-56 md:h-64 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                      </AnimatePresence>
                      
                      {/* Play icon overlay on hover */}
                      {imageCount > 1 && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                          <div className="bg-primary text-black rounded-full p-3 transform scale-90 group-hover:scale-100 transition">
                            <FiPlay size={24} />
                          </div>
                        </div>
                      )}
                      
                      {/* Image count badge */}
                      {imageCount > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FiImage size={12} /> {imageCount} photos
                        </div>
                      )}
                      
                      {/* Slideshow indicator dots */}
                      {imageCount > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.slice(0, 5).map((_, idx) => (
                            <div 
                              key={idx}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                idx === currentPreviewIndex 
                                  ? 'w-4 bg-primary' 
                                  : 'w-1 bg-white/60'
                              }`}
                            />
                          ))}
                          {imageCount > 5 && (
                            <div className="h-1 w-1 rounded-full bg-white/60" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                      <p className="text-primary font-semibold text-sm">{project.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 text-white text-3xl hover:text-primary transition z-10"
              onClick={closeLightbox}
            >
              <FiX />
            </button>
            
            {getProjectImages(selectedProject).length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary transition bg-black/50 rounded-full p-2 z-10 hover:scale-110"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                >
                  <FiChevronLeft />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary transition bg-black/50 rounded-full p-2 z-10 hover:scale-110"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                >
                  <FiChevronRight />
                </button>
                <button 
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full hover:bg-primary hover:text-black transition z-10 flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); toggleAutoPlay(); }}
                >
                  {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                  {isAutoPlaying ? 'Pause' : 'Play Slideshow'}
                </button>
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10">
                  {currentImageIndex + 1} / {getProjectImages(selectedProject).length}
                </div>
              </>
            )}
            
            <div className="max-w-5xl w-full max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
              <motion.img 
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={getProjectImages(selectedProject)[currentImageIndex]} 
                alt={selectedProject.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-t-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
                }}
              />
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-b-lg">
                <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
                <p className="text-gray-200 mt-2 text-sm line-clamp-2">{selectedProject.description}</p>
                <p className="text-primary font-semibold mt-2 text-sm">{selectedProject.date}</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;