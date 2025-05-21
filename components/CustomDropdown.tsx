import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import CustomBottomSheet from "@/components/CustomBottomSheet";

interface CustomDropdownProps {
	data: { label: string; value: string }[];
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

export default function CustomDropdown({
	data,
	placeholder,
	value,
	onChange,
}: CustomDropdownProps) {
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
	const bottomSheetRef = useRef(null);

	const handleOpen = () => {
		bottomSheetRef.current?.present();
	};

	const handleSelect = (item: { label: string; value: string }) => {
		setSelectedLabel(item.label);
		onChange(item.value);
		bottomSheetRef.current?.dismiss();
	};

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.dropdown}
					onPress={handleOpen}
				>
					<Text style={styles.selectedText}>
						{selectedLabel || placeholder}
					</Text>
				</TouchableOpacity>
			</View>
			<CustomBottomSheet ref={bottomSheetRef}>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					keyboardShouldPersistTaps="handled"
				>
					{data.map((item) => (
						<TouchableOpacity
							key={item.value}
							style={styles.option}
							onPress={() => handleSelect(item)}
						>
							<Text style={styles.optionText}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</CustomBottomSheet>
		 </>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	dropdown: {
		height: 50,
		borderColor: "gray",
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
		justifyContent: "center",
		backgroundColor: "#f9f9f9",
	},
	selectedText: {
		fontSize: 16,
		color: "#666",
	},
	scrollContainer: {
		padding: 16,
		maxHeight: Dimensions.get("window").height * 0.5, // Ensure the dropdown does not exceed half the screen height
	},
	option: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	optionText: {
		fontSize: 16,
		color: "#000",
	},
});
