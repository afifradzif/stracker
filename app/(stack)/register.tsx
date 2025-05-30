import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/lib/graphql/auth";
import CustomButton from "@/components/CustomButton";
import CustomBackground from "@/components/CustomBackground";
import CustomTextInput from "@/components/CustomTextInput";

export default function RegisterScreen() {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleRegister = async () => {
		if (!username || !password || !name || !email) {
			Alert.alert("Error", "Please fill in all fields.");
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
				<CustomTextInput
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
				<CustomButton
					text="Register"
					onPress={handleRegister}
					backgroundColor="#D8BFD8"
					textColor="#FFFFFF"
				/>
			</View>
		</CustomBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
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
});
