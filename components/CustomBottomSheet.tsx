import React, { forwardRef, useCallback } from "react";
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";

interface CustomBottomSheetProps {
	children: React.ReactNode;
	snapPoints?: string[]; // Default snap points
	onClose?: () => void; // Optional callback when the modal is closed
}

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
	({ children, onClose }, ref) => {
		const renderBackdrop = useCallback(
			(props: BottomSheetBackdropProps) => (
				<BottomSheetBackdrop
					{...props}
					opacity={0.5}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					enableTouchThrough={false}
				/>
			),
			[]
		);

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					ref={ref}
					backdropComponent={renderBackdrop}
					snapPoints={["85%"]} // Increased height for better keyboard handling
					enablePanDownToClose
					enableDismissOnClose
					keyboardBehavior="extend" // Add this to make sheet extend with keyboard
					android_keyboardInputMode="adjustPan" // Better Android keyboard handling
					style={styles.modal} // Ensure it appears in front
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						style={styles.contentContainer}
					>
						<BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
					</KeyboardAvoidingView>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		);
	}
);

const styles = StyleSheet.create({
	modal: {
		zIndex: 10000, // Ensure the modal appears in front of everything
		elevation: 10, // Add elevation for Android
	},
	contentContainer: {
		flex: 1,
		padding: 10,
	},
});

export default CustomBottomSheet;
