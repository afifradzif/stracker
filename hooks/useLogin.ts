import { useState } from "react";
import { Alert } from "react-native";

export function useLogin() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const handleLogin = (onSuccess: () => void, onError: () => void) => {
		if (credentials.username && credentials.password) {
			// Example logic: Replace with actual authentication logic
			if (credentials.username === "admin" && credentials.password === "password") {
				Alert.alert("Login Successful", "Welcome!");
				onSuccess();
			} else {
				Alert.alert("Login Failed", "Invalid username or password.");
				onError();
			}
		} else {
			Alert.alert("Error", "Please enter both username and password.");
		}
	};

	return { credentials, setCredentials, handleLogin };
}
