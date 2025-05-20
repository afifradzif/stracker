import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
	text: string;
	onPress: () => void;
	backgroundColor: string;
	textColor: string;
	paddingHorizontal?: number;
	elevation?: number; // Optional elevation property
}

export default function CustomButton({
	text,
	onPress,
	backgroundColor,
	textColor,
	paddingHorizontal = 100,
	elevation = 5, // Default elevation value
}: CustomButtonProps) {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				{ backgroundColor, paddingHorizontal, elevation },
			]}
			onPress={onPress}
		>
			<Text style={[styles.text, { color: textColor }]}>{text}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 15,
		borderRadius: 10,
		marginBottom: 20,
	},
	text: {
		fontSize: 18,
		textAlign: "center",
	},
});
