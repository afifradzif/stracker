import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import CustomBackground from "@/components/CustomBackground";

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
					onPress={() => router.push("/(stack)/new-login")} // Navigate to new-login.tsx
					backgroundColor="#FFFFFF"
					textColor="#D8BFD8"
				/>
				<CustomButton
					text="Register"
					onPress={() => {
						// Add navigation logic for register here
					}}
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
