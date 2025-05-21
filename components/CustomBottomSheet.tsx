import React, { forwardRef, useCallback } from "react";
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";

interface CustomBottomSheetProps {
	children: React.ReactNode;
	snapPoints?: string[]; // Default snap points
	onClose?: () => void; // Optional callback when the modal is closed
}

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
	({ children, snapPoints = ["25%"], onClose }, ref) => {
		const renderBackdrop = useCallback(
			(props: BottomSheetBackdropProps) => (
				<BottomSheetBackdrop
					{...props}
					opacity={0.5}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
				/>
			),
			[]
		);

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				enablePanDownToClose
				onDismiss={onClose}
			>
				<BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
			</BottomSheetModal>
		);
	}
);

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 16,
	},
});

export default CustomBottomSheet;
