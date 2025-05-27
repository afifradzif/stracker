import { useState } from "react";
import { Alert } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export function useLogin() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const savedEmail = storage.getString("email");
	const savedPassword = storage.getString("password");


	const handleLogin = (onSuccess: () => void, onError: () => void) => {
		if (credentials.username && credentials.password) {
			// Example logic: Replace with actual authentication logic
			if (credentials.username === savedEmail && credentials.password === savedPassword) {
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
