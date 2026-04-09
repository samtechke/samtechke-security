import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiX, FiStar, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';

const ManageTestimonials = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    date: ''
  });

  // Fetch testimonials from Firebase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const testimonialsData = [];
      querySnapshot.forEach((doc) => {
        testimonialsData.push({ id: doc.id, ...doc.data() });
      });
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
      const newTestimonial = {
        name: formData.name,
        location: formData.location,
        rating: parseInt(formData.rating),
        text: formData.text,
        date: formData.date,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'testimonials'), newTestimonial);
      toast.success('Testimonial added successfully!');
      
      setIsModalOpen(false);
      setFormData({ name: '', location: '', rating: 5, text: '', date: '' });
      fetchTestimonials(); // Refresh list
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error('Failed to add testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        toast.success('Testimonial deleted successfully!');
        fetchTestimonials(); // Refresh list
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar 
        key={i} 
        className={`inline-block ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading testimonials...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Testimonials</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Testimonial
          </button>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">No testimonials yet. Click "Add Testimonial" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition border border-gray-100"
              >
                <div className="mb-3">
                  <div className="text-lg">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-primary text-sm font-semibold">{testimonial.location}</p>
                  <p className="text-gray-400 text-xs mt-1">{testimonial.date}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal - Add Testimonial */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Testimonial</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="e.g., name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="e.g., Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Rating (1-5)</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value={3}>⭐⭐⭐ 3 Stars - Good</option>
                    <option value={2}>⭐⭐ 2 Stars - Fair</option>
                    <option value={1}>⭐ 1 Star - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Review Text</label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="What did they say about SAMTECHKE?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full btn-primary justify-center">
                  Add Testimonial
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;