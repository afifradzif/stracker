import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
}

export default function CustomTextInput({
	placeholder,
	value,
	onChangeText,
	...props
}: CustomTextInputProps) {
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				{...props}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
		marginBottom: 15,
		justifyContent: "center", // Center the input horizontally
		borderRadius: 10,
	},
	input: {
		width: "80%", // Fixed width
		height: 50,
		borderWidth: 1,
		borderColor: "#D8BFD8",
		borderRadius: 5,
		padding: 10,
		backgroundColor: "#FFFFFF",
		fontSize: 16,
		color: "#333",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		textAlign: "left", // Text alignment inside input
	},
});
