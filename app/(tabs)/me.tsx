import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/use-auth";

const ProfileScreen = () => {
	const { signOut } = useAuthStore();
	const router = useRouter();

	const handleSignOut = () => {
		signOut();
		router.navigate("/(stack)/login");
	};

	return (
		<View style={styles.container}>
			<Tabs.Screen
				options={{
					title: "Profile",
				}}
			/>
			<View style={styles.header}>
				<Image
					source={{
						uri: "https://i.pinimg.com/236x/6b/6e/26/6b6e26431100ff8c50c00c585293510d.jpg",
					}}
					style={styles.profilePicture}
				/>
				<Text style={styles.name}>John Doe</Text>
			</View>
			<View style={styles.content}>
				<Text style={styles.label}>About</Text>
				<Text style={styles.info}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut risus
					in augue luctus venenatis.
				</Text>
				<Text style={styles.label}>Contact</Text>
				<Text style={styles.info}>
					Email: example@email.com Phone: 123-456-7890
				</Text>
			</View>
			<TouchableOpacity
				onPress={handleSignOut}
				style={{
					padding: 16,
					backgroundColor: "rgba(255, 0, 0, 0.6)",
					borderWidth: 1,
					borderColor: "rgba(255, 0, 0, 0.9)",
					borderRadius: 8,
				}}
			>
				<Text
					style={{
						color: "white",
					}}
				>
					Log Out
				</Text>
			</TouchableOpacity>
		</View>
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
