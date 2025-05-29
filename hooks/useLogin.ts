import { useState } from "react";
import { loginUser } from "@/lib/graphql/auth";

export function useLogin() {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async (onSuccess: () => void, onError: () => void) => {
		try {
			const response = await loginUser(credentials.username, credentials.password);

			if (response.error) {
				onError();
				return;
			}

			onSuccess();
		} catch (error) {
			onError();
		}
	};

	return { credentials, setCredentials, handleLogin };
}
