import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiPhone, FiCalendar, FiTrash2, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from Firebase
  const fetchMessages = async () => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Auto-mark messages as read when viewed
  useEffect(() => {
    const markCurrentMessagesAsRead = async () => {
      const unreadInView = messages.filter(m => !m.read);
      for (const message of unreadInView) {
        try {
          const messageRef = doc(db, 'messages', message.id);
          await updateDoc(messageRef, { read: true });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
      if (unreadInView.length > 0) {
        fetchMessages(); // Refresh the list
        toast.success(`📬 Marked ${unreadInView.length} message(s) as read`, {
          icon: '✅',
          duration: 2000
        });
      }
    };
    
    if (messages.length > 0 && !loading) {
      markCurrentMessagesAsRead();
    }
  }, [messages, loading]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const messageRef = doc(db, 'messages', id);
      await updateDoc(messageRef, { read: true });
      toast.success('Marked as read');
      fetchMessages(); // Refresh list
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const messageRef = doc(db, 'messages', id);
        await deleteDoc(messageRef);
        toast.success('Message deleted');
        fetchMessages(); // Refresh list
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error('Failed to delete message');
      }
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
          >
            <FiArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-500 mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg p-6 shadow-sm border-l-4 transition-all ${
                !message.read ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                {/* Message Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FiUser className="text-primary" />
                      <span className="font-semibold">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FiPhone className="text-primary" />
                      <a href={`tel:${message.phone}`} className="hover:text-primary transition">
                        {message.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiCalendar />
                      <span>{message.date || (message.timestamp?.toDate ? message.timestamp.toDate().toLocaleDateString() : 'Unknown date')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <FiMail className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-600">{message.message}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!message.read && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-sm"
                    >
                      <FiCheckCircle /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Quick Reply Button */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <a
                  href={`https://wa.me/${message.phone.replace(/\D/g, '')}?text=Hello ${message.name}, thank you for contacting SAMTECHKE. We'll get back to you shortly.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm"
                >
                  <FiCheckCircle /> Reply via WhatsApp
                </a>
              </div>
            </motion.div>
          ))}

          {messages.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
              <FiMail className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-gray-400 text-sm">Messages from the contact form will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;