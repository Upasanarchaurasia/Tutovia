// src/utils/notifications.js
// Push Notification Scheduler for Tutovia

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleNotification(title, options = {}, delayMs = 0) {
  if (Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }, delayMs);
  }
}

export function setupDailyReminders(studyHours, wakeupTime) {
  // Simple scheduler for demo purposes
  // A real app would use a Service Worker for background push notifications
  
  if (Notification.permission !== 'granted') return;

  // Study goal reminder if they haven't met their goal yet (mock implementation)
  const now = new Date();
  
  // Example: schedule a reminder for 5 PM
  const reminderTime = new Date();
  reminderTime.setHours(17, 0, 0, 0);
  
  let delay = reminderTime.getTime() - now.getTime();
  if (delay < 0) {
    // If it's already past 5 PM, schedule for tomorrow
    delay += 24 * 60 * 60 * 1000;
  }

  scheduleNotification(
    'Time to Study! 📚',
    { body: `You have a goal of ${studyHours} hours today. Let's make some progress!` },
    delay
  );
}
