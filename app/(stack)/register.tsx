import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/lib/graphql/auth";
import CustomButton from "@/components/CustomButton";
import CustomBackground from "@/components/CustomBackground";
import CustomTextInput from "@/components/CustomTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();

	const handleRegister = async () => {
		if (!username || !password || !name || !email || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}

		if (password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters long.");
			return;
		}

		const response = await registerUser(username, password, name, email);

		if (response.error) {
			Alert.alert("Error", response.error);
			return;
		}

		Alert.alert("Success", "Registration successful!");
		router.push("/(stack)/login"); // Navigate back to login
	};

	return (
		<CustomBackground>
			<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
				<Text style={styles.backArrow}>←</Text>
			</TouchableOpacity>
			<View style={styles.container}>
				<Text style={styles.title}>Register</Text>
				<CustomTextInput
					placeholder="Full Name"
					value={name}
					onChangeText={setName}
				/>
				<CustomTextInput
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
				/>
				<CustomTextInput
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<View style={styles.passwordContainer}>
					<View style={styles.inputWrapper}>
						<CustomTextInput
							placeholder="Password"
							secureTextEntry={!showPassword}
							value={password}
							onChangeText={setPassword}
						/>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowPassword(!showPassword)}
						>
							<MaterialCommunityIcons
								name={showPassword ? "eye-off" : "eye"}
								size={24}
								color="#666"
							/>
						</TouchableOpacity>
					</View>
				</View>
				
				<View style={styles.passwordContainer}>
					<View style={styles.inputWrapper}>
						<CustomTextInput
							placeholder="Confirm Password"
							secureTextEntry={!showConfirmPassword}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
						/>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							<MaterialCommunityIcons
								name={showConfirmPassword ? "eye-off" : "eye"}
								size={24}
								color="#666"
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<CustomButton
						text="Register"
						onPress={handleRegister}
						backgroundColor="#D8BFD8"
						textColor="#FFFFFF"
					/>
				</View>
			</View>
		</CustomBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#D8BFD8",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
	backButton: {
		position: "absolute",
		top: 70,
		left: 20,
	},
	backArrow: {
		fontSize: 24,
		color: "#FFFFFF",
	},
	buttonContainer: {
		width: "100%",
		alignItems: "center",
	},
	passwordContainer: {
		width: '100%',
		alignItems: 'center',
		// marginBottom: 10,
	},
	inputWrapper: {
		width: '100%',
		position: 'relative',
	},
	eyeIcon: {
		position: 'absolute',
		right: 40,
		top: 10,
		padding: 5,
	},
});
