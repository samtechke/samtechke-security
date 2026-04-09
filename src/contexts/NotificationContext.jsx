import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for new messages
  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('read', '==', false), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.size;
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newMessage = { id: change.doc.id, ...change.doc.data() };
          toast.success(`📬 New message from ${newMessage.name}`, {
            duration: 5000,
            icon: '📬',
            style: {
              background: '#FFD000',
              color: '#000',
              fontWeight: 'bold'
            }
          });
        }
      });
      
      setUnreadCount(count);
    });
    
    return () => unsubscribe();
  }, []);

  // Update app icon badge (for installed PWA)
  useEffect(() => {
    const updateAppBadge = async () => {
      if ('setAppBadge' in navigator) {
        if (unreadCount > 0) {
          await navigator.setAppBadge(unreadCount);
        } else {
          await navigator.clearAppBadge();
        }
      }
    };
    
    updateAppBadge();
  }, [unreadCount]);

  const resetUnreadCount = () => {
    setUnreadCount(0);
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge();
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, resetUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};