import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useRef, useCallback } from "react";
import CustomBackground from "@/components/CustomBackground";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getCurrentUserName } from '@/lib/store/user';
import { useTaskStore } from "@/hooks/use-task";
import { useStudyPlan } from "@/hooks/use-study";
import { useAuthStore } from "@/hooks/use-auth";

export default function HomeScreen() {
	const router = useRouter();
	const bottomSheetRef = useRef(null);
	const { tasks, loadTasks } = useTaskStore();
	const { studyPlans, loadStudyPlans } = useStudyPlan();
	const { auth } = useAuthStore();

	const handleAddButtonPress = () => {
		bottomSheetRef.current?.present();
	};

	const completedTasks = tasks.filter(t => t.completed).length;
	const upcomingStudyPlans = studyPlans
		.filter(p => new Date(p.date) > new Date() && !p.completed)
		.slice(0, 3);

	// Refresh data when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			if (auth.isLoggedIn) {
				loadTasks();
				loadStudyPlans();
			}
		}, [])
	);

	return (
		<CustomBackground>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Hello, {getCurrentUserName()}</Text>
					<Text style={styles.dateText}>As of {new Date().toLocaleDateString()}</Text>
				</View>

				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>{tasks.length}</Text>
						<Text style={styles.statLabel}>Total Tasks</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>{completedTasks}</Text>
						<Text style={styles.statLabel}>Completed</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statNumber}>{studyPlans.length}</Text>
						<Text style={styles.statLabel}>Study Plans</Text>
					</View>
				</View>

				{upcomingStudyPlans.length > 0 && (
					<View style={styles.upcomingContainer}>
						<Text style={styles.sectionTitle}>Upcoming Study Plans</Text>
						{upcomingStudyPlans.map(plan => (
							<TouchableOpacity 
								key={plan.id}
								style={styles.upcomingItem}
								onPress={() => router.push("/(tabs)/study")}
							>
								<Text style={styles.upcomingTitle}>{plan.title}</Text>
								<Text style={styles.upcomingDate}>
									{new Date(plan.date).toLocaleDateString()}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				<View style={styles.menuContainer}>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/study")}
					>
						<AntDesign name="book" size={32} color="#7b45a6" />
						<Text style={styles.menuText}>Study Plans</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/progress")}
					>
						<MaterialCommunityIcons
							name="progress-clock"
							size={32}
							color="#FF8C00"
						/>
						<Text style={styles.menuText}>Progress</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/tasks")}
					>
						<FontAwesome5 name="tasks" size={32} color="#228B22" />
						<Text style={styles.menuText}>Tasks</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuCard}
						onPress={() => router.push("/(tabs)/me")}
					>
						<AntDesign name="user" size={32} color="#6200EE" />
						<Text style={styles.menuText}>Me</Text>
					</TouchableOpacity>
				</View>
				{/* <TouchableOpacity style={styles.floatingButton} onPress={handleAddButtonPress}>
					<Text style={styles.floatingButtonText}>+</Text>
				</TouchableOpacity> */}
			</SafeAreaView>
			<CustomBottomSheet ref={bottomSheetRef}>
					<View style={styles.bottomSheetContent}>
						<TouchableOpacity
							style={styles.bottomSheetButton}
							onPress={() => {
								router.push("/(stack)/study");
								bottomSheetRef.current?.dismiss();
							}}
						>
							<Text style={styles.bottomSheetButtonText}>Add Study Plan</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bottomSheetButton}
							onPress={() => {
								router.push("/(stack)/add-tasks");
								bottomSheetRef.current?.dismiss();
							}}
						>
							<Text style={styles.bottomSheetButtonText}>Add Task</Text>
						</TouchableOpacity>
					</View>
				</CustomBottomSheet>
		</CustomBackground>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	header: {
		marginTop: 10,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	dateText: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: 20,
		paddingHorizontal: 10,
	},
	statCard: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 15,
		alignItems: 'center',
		elevation: 3,
		width: '30%',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#7b45a6',
	},
	statLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	upcomingContainer: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 15,
		marginHorizontal: 10,
		marginBottom: 20,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	upcomingItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	upcomingTitle: {
		fontSize: 14,
		color: '#333',
	},
	upcomingDate: {
		fontSize: 12,
		color: '#666',
	},
	menuContainer: {
		flexDirection: "row",
		backgroundColor: "#F5F5F5",
		borderRadius: 10,
		padding: 20,
		height: 100,
		marginTop: 10,
		elevation: 3,
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
	},
	menuCard: {
		width: 80,
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	menuText: {
		marginTop: 8,
		fontSize: 12,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
	},
	divider: {
		width: 1,
		height: 60,
		backgroundColor: "#ccc",
	},
	floatingButton: {
		position: "absolute",
		bottom: 30,
		right: 10,
		backgroundColor: "#6200EE",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	floatingButtonText: {
		color: "#FFFFFF",
		fontSize: 28,
		fontWeight: "bold",
	},
	bottomSheetContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	bottomSheetButton: {
		width: "100%",
		padding: 16,
		backgroundColor: "#6200EE",
		borderRadius: 8,
		marginBottom: 16,
		alignItems: "center",
	},
	bottomSheetButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});
