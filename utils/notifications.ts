import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7b45a6',
    });
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleNotification(title: string, body: string, trigger: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger,
  });
}

export const calculateReminderDate = (dueDate: Date, reminderType: string): Date => {
  const now = new Date();
  const targetDate = new Date(dueDate);

  switch (reminderType) {
    case '1 day before':
      targetDate.setDate(targetDate.getDate() - 1);
      break;
    case '1 week before':
      targetDate.setDate(targetDate.getDate() - 7);
      break;
    case 'Everyday':
      // For everyday reminders, set it to the next occurrence of the reminder time
      targetDate.setHours(9, 0, 0, 0); // Set to 9 AM
      if (targetDate < now) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      break;
  }

  // Ensure reminder time is in the future
  if (targetDate <= now) {
    targetDate.setDate(now.getDate() + 1);
    targetDate.setHours(9, 0, 0, 0);
  }

  return targetDate;
};

export const setupDailyMotivation = async (type: string, studyTitle: string) => {
  const motivationalMessages = [
    "Keep going! You're making progress on your study plan.",
    "Every study session brings you closer to your goals!",
    "Stay focused and maintain your study momentum!",
  ];

  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  let trigger;
  switch (type) {
    case 'Every week':
      trigger = {
        repeats: true,
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
      };
      break;
    case 'Every month':
      trigger = {
        repeats: true,
        day: 1,
        hour: 9,
        minute: 0,
      };
      break;
    default: // Everyday
      trigger = {
        repeats: true,
        hour: 9,
        minute: 0,
      };
  }

  return await schedulePushNotification({
    title: `Study Motivation - ${studyTitle}`,
    body: message,
    trigger,
  });
};

export const schedulePushNotification = async ({
  title,
  body,
  trigger,
}: {
  title: string;
  body: string;
  trigger: Date;
}) => {
  const seconds = Math.max(1, Math.floor((trigger.getTime() - Date.now()) / 1000));
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      seconds: seconds,
    },
  });
};
