import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarker, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Save message to Firebase Firestore
      const messagesCollection = collection(db, 'messages');
      await addDoc(messagesCollection, {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: serverTimestamp(),
        read: false
      });
      
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Get in touch for a free consultation and quote
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Ready to secure your property? Contact us today for a free consultation and quote.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <FaPhone className="text-primary text-2xl" />
                  <div>
                    <p className="text-gray-500 text-sm">Call Us</p>
                    <a href="tel:+254729289847" className="text-gray-900 font-semibold">+254 729 289847</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <FaWhatsapp className="text-green-500 text-2xl" />
                  <div>
                    <p className="text-gray-500 text-sm">WhatsApp</p>
                    <a href="https://wa.me/254729289847" className="text-gray-900 font-semibold">+254 729 289847</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <FaEnvelope className="text-primary text-2xl" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <a href="mailto:samtechkesystems@gmail.com" className="text-gray-900 font-semibold">samtechkesystems@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <FaMapMarker className="text-primary text-2xl" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-900 font-semibold">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <FaClock className="text-primary text-2xl" />
                  <div>
                    <p className="text-gray-500 text-sm">Working Hours</p>
                    <p className="text-gray-900 font-semibold">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form - Light Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg p-8 shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="+254 700 000000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="Tell us about your security needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary justify-center"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Google Map Placeholder - Light Theme */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Location</h3>
            <div className="bg-white rounded-lg overflow-hidden h-96 shadow-md border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.123456789!2d36.821946!3d-1.292066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10c0b1234567%3A0x123456789abcdef!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="SAMTECHKE Location"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;