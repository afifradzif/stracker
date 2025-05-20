import React from "react";
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomBackgroundProps {
	children: React.ReactNode;
	colors?: string[]; // Optional custom gradient colors
	style?: ViewStyle; // Optional custom styles for the container
}

const { height, width } = Dimensions.get("window");

export default function CustomBackground({
	children,
	colors = ["#D8BFD8", "#E6E6FA", "#FFFFFF"], // Default gradient colors
	style = {},
}: CustomBackgroundProps) {
	return (
		<View style={[styles.gradient, style]}>
			<View style={styles.curvedShape} />
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	curvedShape: {
		position: "absolute",
		top: 0, // Curve at the top
		width: "100%",
		height: height * 0.6, // Adjust the height of the curve as needed
		backgroundColor: "#d6bbea",
		borderBottomLeftRadius: width * 0.8 ,
		borderBottomRightRadius: width * 0.3,
	},
});
