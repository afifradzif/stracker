import { Stack } from "expo-router";
import React from "react";

export default function TabsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="add-tasks" />
			<Stack.Screen
				name="login"
				options={{
					headerShown: false,
				}}
			 />
			<Stack.Screen
				name="new-login"
				options={{
					headerShown: false,
				}}
			 />
			<Stack.Screen
				name="register"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
