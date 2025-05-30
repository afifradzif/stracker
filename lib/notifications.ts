import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_TOKEN_KEY = '@notification_token';

export const saveNotificationToken = async (token: string) => {
  await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
};

export const removeNotificationToken = async () => {
  await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
};
