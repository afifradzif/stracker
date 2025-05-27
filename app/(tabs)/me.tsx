import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/use-auth";
import { useTaskStore } from "@/hooks/use-task";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import CustomButton from "@/components/CustomButton";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProfileScreen = () => {
	const { signOut } = useAuthStore();
	const { clearTasks } = useTaskStore();
	const router = useRouter();

	const handleClearData = () => {
		clearTasks();
		router.push("/(tabs)");
	};

	const handleSignOut = () => {
		signOut();
		router.navigate("/(stack)/login");
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
			<CustomButton
				text={'Clear All Data'}
				onPress={handleClearData}
				backgroundColor="#3CB371"
				textColor="#FFFFFF"
			/>
			<CustomButton
				text={'Log Out'}
				onPress={handleSignOut}
				backgroundColor="#FF0000"
				textColor="#FFFFFF"
			/>
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
});

export default ProfileScreen;
