import { useAuthStore } from "@/hooks/use-auth";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Toast from "react-native-root-toast";

export default function LoginScreen() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const router = useRouter();
	const { signIn } = useAuthStore();

	const handleLogin = async () => {
		if (signIn(credentials)) {
			console.log("Login successful");
			Toast.show("Login successful", {
				containerStyle: {
					backgroundColor: "#00ff00",
					width: "100%",
				},
				shadow: false,
				duration: Toast.durations.SHORT,
			});

			router.push("/(tabs)");
		} else {
			Toast.show("Invalid credentials", {
				containerStyle: {
					backgroundColor: "#ff0000",
					width: "100%",
				},
				shadow: false,
				duration: Toast.durations.LONG,
			});
		}
	};

	return (
		<SafeAreaView style={loginStyles.container}>
			<View style={loginStyles.logoContainer}>
				<Image
					source={require("@/assets/images/logotransparent1.png")}
					contentFit="contain"
					style={{
						width: 120,
						height: 120,
					}}
				/>
			</View>

			<View style={loginStyles.inputContainer}>
				<TextInput
					placeholder="Username"
					style={loginStyles.input}
					keyboardType="default"
					autoCapitalize="none"
					onChangeText={(text) =>
						setCredentials({ ...credentials, username: text })
					}
				/>
				<TextInput
					placeholder="Password"
					style={loginStyles.input}
					secureTextEntry
					onChangeText={(text) =>
						setCredentials({ ...credentials, password: text })
					}
				/>
				<TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
					<Text style={loginStyles.loginButtonText}>Log In</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const loginStyles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		backgroundColor: "#fff",
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 60,
		marginBottom: 10,
	},
	inputContainer: {
		gap: 16,
		marginBottom: 24,
		padding: 20,
		width: "100%",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	loginButton: {
		backgroundColor: "#7b45a6",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	loginButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
