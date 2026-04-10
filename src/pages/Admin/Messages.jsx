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
  const [expandedMessages, setExpandedMessages] = useState({});

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
        fetchMessages();
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
      fetchMessages();
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
        fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error('Failed to delete message');
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
      <div className="p-4 md:p-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition w-fit"
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
          {messages.map((message, index) => {
            const isExpanded = expandedMessages[message.id];
            const messageText = message.message || '';
            const shouldTruncate = messageText.length > 150;
            const displayText = isExpanded ? messageText : truncateText(messageText, 150);

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg p-4 md:p-6 shadow-sm border-l-4 transition-all overflow-hidden ${
                  !message.read ? 'border-primary' : 'border-gray-200'
                }`}
              >
                {/* Header Info */}
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FiUser className="text-primary flex-shrink-0" />
                      <span className="font-semibold break-words max-w-[150px] md:max-w-none">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FiPhone className="text-primary flex-shrink-0" />
                      <a href={`tel:${message.phone}`} className="hover:text-primary transition break-all">
                        {message.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiCalendar className="flex-shrink-0" />
                      <span>{message.date || (message.timestamp?.toDate ? message.timestamp.toDate().toLocaleDateString() : 'Unknown date')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 self-start">
                    {!message.read && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition text-sm"
                      >
                        <FiCheckCircle size={14} /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition text-sm"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Message Content with Word Wrap */}
                <div className="flex items-start gap-2 mb-4">
                  <FiMail className="text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 break-words whitespace-pre-wrap overflow-wrap-anywhere">
                      {displayText}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(message.id)}
                        className="text-primary text-sm mt-2 hover:underline"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Reply Button */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <a
                    href={`https://wa.me/${message.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(message.name)}, thank you for contacting SAMTECHKE. We'll get back to you shortly.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm"
                  >
                    <FiCheckCircle /> Reply via WhatsApp
                  </a>
                </div>
              </motion.div>
            );
          })}

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