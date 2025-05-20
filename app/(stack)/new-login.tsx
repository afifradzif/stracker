import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useLogin } from "@/hooks/useLogin";
import CustomTextInput from "@/components/CustomTextInput";
import CustomBackground from "@/components/CustomBackground";

export default function NewLoginScreen() {
	const { credentials, setCredentials, handleLogin } = useLogin();
	const router = useRouter();

	const onSuccess = () => {
		Alert.alert("Login Successful", "Welcome!");
		router.push("/(tabs)"); // Navigate to the main tabs page
	};

	const onError = () => {
		Alert.alert("Login Failed", "Invalid email/phone or password.");
	};

	return (
			<CustomBackground>
				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Text style={styles.backArrow}>←</Text>
				</TouchableOpacity>
				<Text style={styles.title}>Log in</Text>
				<View style={styles.inputContainer}>
					<CustomTextInput
						value={credentials.username}
						onChangeText={(text) => setCredentials({ ...credentials, username: text })}
						placeholder="Email / Phone Number"
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<CustomTextInput
						value={credentials.password}
						onChangeText={(text) => setCredentials({ ...credentials, password: text })}
						placeholder="Password"
						secureTextEntry
					/>
					<TouchableOpacity style={styles.loginButton} onPress={() => handleLogin(onSuccess, onError)}>
						<Text style={styles.loginButtonText}>Log in</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Reset password functionality coming soon!")}>
					<Text style={styles.forgotPassword}>Forgot Password?</Text>
				</TouchableOpacity>
			</CustomBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	backButton: {
		position: "absolute",
		top: 40,
		left: 20,
	},
	backArrow: {
		fontSize: 24,
		color: "#FFFFFF",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 40,
	},
	inputContainer: {
		width: "100%",
		alignItems: "center",
	},
	loginButton: {
		width: "80%",
		height: 50,
		backgroundColor: "#FFFFFF",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	loginButtonText: {
		color: "#D8BFD8",
		fontSize: 18,
		fontWeight: "bold",
	},
	forgotPassword: {
		color: "#696969",
		marginTop: 20,
		fontSize: 14,
	},
});