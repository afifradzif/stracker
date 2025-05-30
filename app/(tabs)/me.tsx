import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/use-auth";
import CustomBackground from "@/components/CustomBackground";
import CustomButton from "@/components/CustomButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getCurrentUserName } from '@/lib/store/user';
import { useState, useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import { removeNotificationToken, saveNotificationToken } from '@/lib/notifications';
import { useTaskStore } from '@/hooks/use-task';
import { useStudyPlan } from '@/hooks/use-study';

const ProfileScreen = () => {
	const { signOut } = useAuthStore();
	const router = useRouter();
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const { removeAllTasks } = useTaskStore();
	const { removeAllStudyPlans } = useStudyPlan();

	useEffect(() => {
		checkNotificationPermissions();
	}, []);

	const checkNotificationPermissions = async () => {
		const { status } = await Notifications.getPermissionsAsync();
		setNotificationsEnabled(status === 'granted');
	};

	const handleNotificationToggle = async (value: boolean) => {
		if (value) {
			const token = await registerForPushNotificationsAsync();
			if (token) {
				setNotificationsEnabled(true);
				await saveNotificationToken(token);
			} else {
				Alert.alert(
					'Permission Required',
					'Please enable notifications in your device settings.'
				);
				setNotificationsEnabled(false);
			}
		} else {
			setNotificationsEnabled(false);
			// await Notifications.setNotificationHandler({
			// 	handleNotification: async () => ({
			// 		shouldShowAlert: false,
			// 		shouldPlaySound: false,
			// 		shouldSetBadge: false,
			// 	}),
			// });
			// await removeNotificationToken();
			// Alert.alert('Notifications Disabled', 'You will no longer receive notifications');
		}
	};

	const handleSignOut = () => {
		signOut();
		router.navigate("/(stack)/login");
	};

	const handleClearAllData = () => {
		Alert.alert(
			'Clear All Data',
			'Are you sure you want to remove all your tasks, study plans, and progress? This action cannot be undone.',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Clear All',
					style: 'destructive',
					onPress: async () => {
						try {
							await removeAllTasks();
							await removeAllStudyPlans();
							router.replace('/(tabs)'); // Replace instead of push to refresh the stats
							Alert.alert('Success', 'All data has been cleared.');
						} catch (error) {
							Alert.alert('Error', 'Failed to clear data.');
						}
					},
				},
			]
		);
	};

	return (
		<CustomBackground>
			<Tabs.Screen
				options={{
					headerShown: true,
					title: "Me",
					headerLeft: () => (
						<TouchableOpacity
							style={{ marginLeft: 16 }}
							onPress={() => router.back()}
						>
							<AntDesign name="arrowleft" size={24} color="black" />
						</TouchableOpacity>
					)
				}}
			/>
			
			<View style={styles.profileSection}>
				<View style={styles.avatarPlaceholder}>
					<Text style={styles.avatarText}>
						{getCurrentUserName().charAt(0).toUpperCase()}
					</Text>
				</View>
				<Text style={styles.userName}>{getCurrentUserName()}</Text>
			</View>

			<View style={styles.settingsSection}>
				<View style={styles.settingItem}>
					<Text style={styles.settingLabel}>Notifications</Text>
					<Switch
						value={notificationsEnabled}
						onValueChange={handleNotificationToggle}
						trackColor={{ false: "#767577", true: "#7b45a6" }}
					/>
				</View>

				<TouchableOpacity 
					style={styles.menuItem}
					onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
				>
					<Text style={styles.menuText}>Account Settings</Text>
					<AntDesign name="right" size={20} color="#666" />
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.menuItem}
					onPress={() => Alert.alert('Need Help?', 'Contact us at support@stracker.com')}
				>
					<Text style={styles.menuText}>Help & Support</Text>
					<AntDesign name="right" size={20} color="#666" />
				</TouchableOpacity>

				<TouchableOpacity 
					style={[styles.menuItem]}
					onPress={handleClearAllData}
				>
					<Text style={[styles.menuText]}>Clear All Data</Text>
					<AntDesign name="delete" size={20} color="#FF0000" />
				</TouchableOpacity>
			</View>
			
			<View style={styles.content}>
				<CustomButton
					text="Log Out"
					onPress={handleSignOut}
					backgroundColor="#FF0000"
					textColor="#FFFFFF"
				/>
			</View>
		</CustomBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
	header: {
		alignItems: "center",
		marginVertical: 24,
	},
	profilePicture: {
		width: 120,
		height: 120,
		borderRadius: 60,
		marginBottom: 12,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
	},
	content: {
		marginVertical: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
	},
	info: {
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
	},
	profileSection: {
		alignItems: 'center',
		padding: 20,
		marginTop: 20,
	},
	avatarPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#7b45a6',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	avatarText: {
		fontSize: 40,
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	settingsSection: {
		flex: 1,
		padding: 20,
		width: '100%',
	},
	settingItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	settingLabel: {
		fontSize: 16,
		color: '#333',
	},
	menuItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	menuText: {
		fontSize: 16,
		color: '#333',
	},
});

export default ProfileScreen;
