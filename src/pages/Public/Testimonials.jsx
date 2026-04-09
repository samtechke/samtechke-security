import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Firebase
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const testimonialsData = [];
        querySnapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() });
        });
        
        setTestimonialsList(testimonialsData);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  // Calculate average rating
  const averageRating = testimonialsList.length > 0 
    ? (testimonialsList.reduce((sum, t) => sum + t.rating, 0) / testimonialsList.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading testimonials...</div>
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
            What Our <span className="text-primary">Clients Say</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Real reviews from satisfied customers across Kenya
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid - Light Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {testimonialsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No testimonials yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialsList.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-primary text-sm font-semibold">{testimonial.location}</p>
                    <p className="text-gray-400 text-xs mt-1">{testimonial.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rating Summary - Yellow Theme */}
      {testimonialsList.length > 0 && (
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-black mb-2">{averageRating}</div>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((i) => (
                  <FaStar key={i} className="text-black text-2xl" />
                ))}
              </div>
              <p className="text-black/70 text-lg">Based on {testimonialsList.length} customer review{testimonialsList.length !== 1 ? 's' : ''}</p>
              <a href="https://wa.me/254729289847" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">
                Leave a Review
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Testimonials;