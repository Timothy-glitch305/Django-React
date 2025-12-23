import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		auth().catch(() => {
			setIsAuthorized(false);
		});
	}, []);

	const auth = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setIsAuthorized(false);
			return;
		}
		const decoded = jwtDecode(token);
		const expiration = decoded.exp;
		const now = Date.now() / 1000;
		if (expiration < now) {
			await refresh_token();
		} else {
			setIsAuthorized(true);
		}
	};

	const refresh_token = async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);
		try {
			const response = await api.post("auth/token/refresh/", {
				refresh: refreshToken,
			});
			if (response.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, response.data.access);
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
			}
		} catch (error) {
			setIsAuthorized(false);
		}
	};
	if (isAuthorized === null) {
		return <div>Loading</div>;
	}
	return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
