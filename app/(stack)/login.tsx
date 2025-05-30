import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import CustomBackground from "@/components/CustomBackground";
import { MMKV } from "react-native-mmkv";
import { useBiometrics } from "@/hooks/useBiometrics";
import React, { useState } from "react";
import { loginUser } from "@/lib/graphql/auth";

const storage = new MMKV();

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { authenticate } = useBiometrics();

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields.");
			return;
		}

		const response = await loginUser(email, password);

		if (response.error) {
			Alert.alert("Error", response.error);
			return;
		}

		Alert.alert("Success", "Login successful!");
		router.push("/(tabs)"); // Navigate to main app
	};

	return (
		<CustomBackground>
			<View style={{ alignItems: "center" }}>
				<Image
					source={require("@/assets/images/logotransparent1.png")}
					style={{ width: 150, height: 125 }}
				/>
			</View>
			<View style={{ marginTop: 40 }}>
				<CustomButton
					text="Log in"
					// onPress={(handleLogin)} // Validate credentials
					onPress={() => router.push("/(stack)/new-login")} // Navigate to login.tsx
					backgroundColor="#FFFFFF"
					textColor="#D8BFD8"
				/>
				<CustomButton
					text="Register"
					onPress={() => router.push("/(stack)/register")} // Navigate to register.tsx
					backgroundColor="#D8BFD8"
					textColor="#483D8B"
					paddingHorizontal={90}
				/>
			</View>
		</CustomBackground>
	);
}
