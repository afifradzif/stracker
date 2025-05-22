import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

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
		<TextInput
			style={styles.input}
			placeholder={placeholder}
			value={value}
			onChangeText={onChangeText}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: "#D8BFD8",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
});
