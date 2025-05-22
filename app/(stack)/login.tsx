import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import CustomBackground from "@/components/CustomBackground";
import { MMKV } from "react-native-mmkv";
import { useBiometrics } from "@/hooks/useBiometrics";

const storage = new MMKV();

export default function LoginScreen() {
	const router = useRouter();
	const { authenticate } = useBiometrics();

	const handleLogin = async () => {
		try {
			const biometricSuccess = await authenticate();
			if (!biometricSuccess) {
				Alert.alert("Authentication Failed", "Biometric authentication failed");
				router.push("/(stack)/new-login");
				return;
			}

			const savedEmail = storage.getString("email");
			const savedPassword = storage.getString("password");

			if (savedEmail && savedPassword) {
				Alert.alert("Success", "Login successful!");
				router.push("/(tabs)");
			} else {
				router.push("/(stack)/new-login");
			}
		} catch (error) {
			console.error("Login error:", error);
			Alert.alert("Error", "Authentication failed");
		}
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
					onPress={handleLogin} // Validate credentials
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
			<View style={{ flexDirection: "row", marginTop: 20 }}>
				<TouchableOpacity style={{ marginHorizontal: 10 }}>
					<Image
						source={{ uri: "https://img.icons8.com/color/50/000000/google-logo.png" }}
						style={{ width: 40, height: 40 }}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={{ marginHorizontal: 10 }}>
					<MaterialIcons name="phone" size={40} color="#D8BFD8" />
				</TouchableOpacity>
			</View>
			<Text style={{ color: "#696969", marginTop: 10 }}>Don't have an account yet?</Text>
		</CustomBackground>
	);
}
