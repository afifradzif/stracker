import { View } from "react-native";
import { Image } from "expo-image";

const LoadingScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#fff",
			}}
		>
			<Image
				source={require("../../assets/images/logotransparent1.png")}
				style={{ width: 200, height: 200 }}
			/>
		</View>
	);
};

export default LoadingScreen;
