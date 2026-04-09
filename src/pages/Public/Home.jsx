import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaArrowRight, FaWhatsapp, FaPhone, FaStar, FaImages, FaComments, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// YOUR REAL IMAGES
import logo from './images/file_00000000ac1471f5b6bc76d30b671d9d.png';
import electricFence from './images/electric-fence-warning.jpg';
import samImage from './images/Screenshot_2026-04-09-13-52-26-195_com.whatsapp.w4b~2.jpg';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);
  const [visibleServices, setVisibleServices] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesRef);
        const servicesData = [];
        servicesSnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() });
        });
        setServices(servicesData);

        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(projectsRef, orderBy('date', 'desc'));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = [];
        projectsSnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        setProjects(projectsData);

        const testimonialsRef = collection(db, 'testimonials');
        const testimonialsQuery = query(testimonialsRef, orderBy('date', 'desc'));
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        const testimonialsData = [];
        testimonialsSnapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() });
        });
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`inline-block text-xs md:text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const loadMoreProjects = () => setVisibleProjects(prev => prev + 3);
  const loadMoreTestimonials = () => setVisibleTestimonials(prev => prev + 3);
  const loadMoreServices = () => setVisibleServices(prev => prev + 4);

  const hasMoreProjects = visibleProjects < projects.length;
  const hasMoreTestimonials = visibleTestimonials < testimonials.length;
  const hasMoreServices = visibleServices < services.length;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-12 md:py-16">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src={logo} alt="SAMTECHKE Logo" className="w-full max-w-md md:max-w-2xl object-contain" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={logo} alt="SAMTECHKE Logo" className="h-12 md:h-16 w-auto mx-auto mb-3" />
          <span className="text-primary text-xs md:text-sm font-semibold tracking-wider block mb-3">WELCOME TO SAMTECHKE</span>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 px-2">
            Kenya's Leading{' '}
            <span className="text-primary">Security Systems</span>
            <br />
            Installation Experts
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 mb-5 max-w-2xl mx-auto px-4">
            Protecting homes and businesses across Kenya with professional security solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <a href="tel:+254729289847" className="btn-primary text-base md:text-lg py-2 md:py-3">
              <FaPhone className="inline mr-2" /> Call Now
            </a>
            <a href="https://wa.me/254729289847" className="btn-secondary text-base md:text-lg py-2 md:py-3">
              <FaWhatsapp className="inline mr-2" /> WhatsApp Chat
            </a>
          </div>
          
          <p className="text-gray-500 text-xs md:text-sm mt-5 px-4">
            🏆 Trusted by many happy customers across Kenya | Call/WhatsApp: 0729 289 847
          </p>
        </div>
      </section>

      {/* TWO IMAGES */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-primary/20 via-white to-primary/10 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
              <img src={samImage} alt="SAMTECHKE" className="w-full h-auto rounded-lg" loading="lazy" />
              <div className="p-2 text-center">
                <h3 className="font-bold text-gray-800 text-sm">SAMTECHKE Security</h3>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-red-500/20 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
              <img src={electricFence} alt="Electric Fence" className="w-full h-auto rounded-lg" loading="lazy" />
              <div className="p-2 text-center">
                <h3 className="font-bold text-gray-800 text-sm">Electric Fence</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE PAGES */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Explore <span className="text-primary">SAMTECHKE</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <Link to="/services" className="bg-white rounded-lg p-3 md:p-5 text-center shadow-md hover:shadow-xl transition">
              <div className="bg-primary/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaShieldAlt className="text-primary text-lg md:text-2xl" />
              </div>
              <h3 className="text-sm md:text-base font-bold">Services</h3>
              <span className="text-primary text-xs">View All →</span>
            </Link>
            <Link to="/gallery" className="bg-white rounded-lg p-3 md:p-5 text-center shadow-md hover:shadow-xl transition">
              <div className="bg-primary/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaImages className="text-primary text-lg md:text-2xl" />
              </div>
              <h3 className="text-sm md:text-base font-bold">Projects</h3>
              <span className="text-primary text-xs">View All →</span>
            </Link>
            <Link to="/testimonials" className="bg-white rounded-lg p-3 md:p-5 text-center shadow-md hover:shadow-xl transition">
              <div className="bg-primary/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaComments className="text-primary text-lg md:text-2xl" />
              </div>
              <h3 className="text-sm md:text-base font-bold">Reviews</h3>
              <span className="text-primary text-xs">Read All →</span>
            </Link>
            <Link to="/contact" className="bg-white rounded-lg p-3 md:p-5 text-center shadow-md hover:shadow-xl transition">
              <div className="bg-primary/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaHeadset className="text-primary text-lg md:text-2xl" />
              </div>
              <h3 className="text-sm md:text-base font-bold">Contact</h3>
              <span className="text-primary text-xs">Get in Touch →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Our Services</h2>
            <Link to="/services" className="text-primary text-sm hover:underline">View All →</Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No services yet. Add in admin!</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {services.slice(0, visibleServices).map((service) => (
                  <Link key={service.id} to="/services" className="bg-white rounded-lg p-3 md:p-4 text-center shadow-md border border-gray-100 hover:shadow-lg transition">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{service.title}</h3>
                  </Link>
                ))}
              </div>
              {hasMoreServices && (
                <div className="text-center mt-6">
                  <button onClick={loadMoreServices} className="text-primary text-sm hover:underline">
                    Load More Services →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Link to="/gallery" className="text-primary text-sm hover:underline">View All →</Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No projects yet. Add in admin!</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {projects.slice(0, visibleProjects).map((project) => (
                  <Link key={project.id} to="/gallery" className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                    <img src={project.image} alt={project.title} className="w-full h-40 md:h-48 object-cover" loading="lazy" />
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{project.title}</h3>
                      <p className="text-primary text-xs mt-1">{project.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {hasMoreProjects && (
                <div className="text-center mt-6">
                  <button onClick={loadMoreProjects} className="text-primary text-sm hover:underline">
                    Load More Projects →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">What Clients Say</h2>
            <Link to="/testimonials" className="text-primary text-sm hover:underline">Read All →</Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No testimonials yet. Add in admin!</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {testimonials.slice(0, visibleTestimonials).map((testimonial) => (
                  <Link key={testimonial.id} to="/testimonials" className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition">
                    <div className="mb-2">{renderStars(testimonial.rating)}</div>
                    <p className="text-gray-600 text-sm italic line-clamp-3">"{testimonial.text}"</p>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <h4 className="font-bold text-gray-800 text-sm">{testimonial.name}</h4>
                      <p className="text-primary text-xs">{testimonial.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {hasMoreTestimonials && (
                <div className="text-center mt-6">
                  <button onClick={loadMoreTestimonials} className="text-primary text-sm hover:underline">
                    Load More Reviews →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-8 md:py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg md:text-2xl font-bold text-black mb-2">Ready to Secure Your Property?</h2>
          <p className="text-black/70 mb-4 text-sm">Get a free quote today - No obligation</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="bg-black text-white px-5 py-2 rounded-lg font-bold text-sm">Contact Us</Link>
            <a href="https://wa.me/254729289847" className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm">WhatsApp Chat</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;