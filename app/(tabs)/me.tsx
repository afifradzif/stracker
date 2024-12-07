import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/hooks/use-auth";

export default function TabTwoScreen() {
	const { signOut } = useAuthStore();
	const router = useRouter();

	const handleSignOut = () => {
		signOut();
		router.navigate("/(stack)/login");
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
}
