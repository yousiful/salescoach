import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for random notifications
const users = [
  { name: 'Sarah Chen', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { name: 'Michael Rodriguez', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { name: 'Aisha Patel', image: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg' },
  { name: 'James Wilson', image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg' },
  { name: 'Emma Thompson', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
  { name: 'David Kim', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg' },
  { name: 'Maria Garcia', image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg' },
  { name: 'John Smith', image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg' }
];

const achievements = [
  'just completed the Closing Fundamentals course',
  'mastered objection handling',
  'finished advanced negotiation training',
  'completed NEPQ methodology training',
  'achieved perfect score in role-play',
  'unlocked advanced sales techniques',
  'completed their first successful demo',
  'mastered value proposition delivery'
];

const ActivityNotifications: React.FC = () => {
  const [notification, setNotification] = useState<{
    user: typeof users[0];
    achievement: string;
  } | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
      
      setNotification({ user: randomUser, achievement: randomAchievement });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 5000);

    // Show new notification every 8-15 seconds
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: -50 }}
            className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 max-w-sm flex items-center space-x-4"
          >
            <img
              src={notification.user.image}
              alt={notification.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">
                {notification.user.name}
              </p>
              <p className="text-sm text-slate-600">
                {notification.achievement}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityNotifications;