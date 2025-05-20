import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
}

export default function CustomTextInput({
	value,
	onChangeText,
	placeholder,
	...props
}: CustomTextInputProps) {
	return (
		<TextInput
			style={styles.input}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor="#999"
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		width: "80%",
		height: 50,
		backgroundColor: "#FFFFFF",
		borderRadius: 25,
		paddingHorizontal: 20,
		marginBottom: 20,
		fontSize: 16,
		elevation: 5,
	},
});
