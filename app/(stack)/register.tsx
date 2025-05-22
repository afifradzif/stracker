import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { MMKV } from "react-native-mmkv";
import CustomBackground from "@/components/CustomBackground";
import CustomTextInput from "@/components/CustomTextInput";

const storage = new MMKV();

export default function RegisterScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleRegister = () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields.");
			return;
		}

		// Save credentials to MMKV
		storage.set("email", email);
		storage.set("password", password);

		Alert.alert("Success", "Registration successful!");
		router.push("/(stack)/login"); // Navigate back to login
	};

	return (
		<CustomBackground>
			<View style={styles.container}>
				<Text style={styles.title}>Register</Text>
				<CustomTextInput
					placeholder="Email/Username"
					value={email}
					onChangeText={setEmail}
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
