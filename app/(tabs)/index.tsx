import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
	const router = useRouter();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 24,
				backgroundColor: "#f5f5f5",
			}}
		>
			<Text
				style={{
					fontSize: 32,
					marginBottom: 40,
					fontWeight: "bold",
					color: "#333",
					textShadowColor: "rgba(0, 0, 0, 0.1)",
					textShadowOffset: { width: 1, height: 1 },
					textShadowRadius: 2,
				}}
			>
				Hello, Admin
			</Text>
			<View style={{ width: "100%", maxWidth: 320 }}>
				<TouchableOpacity
					onPress={() => router.push("/(stack)/study")}
					style={{
						backgroundColor: "rgba(123, 69, 166, 0.8)",
						borderWidth: 2,
						borderColor: "rgba(123, 69, 166, 1.0)",
						padding: 20,
						borderRadius: 16,
						alignItems: "center",
						marginBottom: 16,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.2,
						shadowRadius: 4,
					}}
				>
					<Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
						Study Plans
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => router.navigate("/(tabs)/progress")}
					style={{
						backgroundColor: "rgba(255, 140, 0, 0.6)",
						borderWidth: 2,
						borderColor: "rgba(255, 140, 0, 1.0)",
						padding: 20,
						borderRadius: 16,
						alignItems: "center",
						marginBottom: 16,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.2,
						shadowRadius: 4,
					}}
				>
					<Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
						Progress
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => router.navigate("/(tabs)/tasks")}
					style={{
						backgroundColor: "rgba(34, 139, 34, 0.8)",
						borderWidth: 2,
						borderColor: "rgba(34, 139, 34, 1.0)",
						padding: 20,
						borderRadius: 16,
						alignItems: "center",
						marginBottom: 16,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.2,
						shadowRadius: 4,
					}}
				>
					<Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
						Tasks
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
