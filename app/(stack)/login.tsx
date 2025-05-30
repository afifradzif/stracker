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
	const router = useRouter();

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
