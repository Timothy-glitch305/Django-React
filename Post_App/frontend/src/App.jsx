import React from "react";
import { Route, Navigate, BrowserRouter, Routes } from "react-router-dom";
import PostPage from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Search from "./pages/Search";
import EditUser from "./pages/EditUser";
import EditComment from "./pages/EditCommet";
import CreatePost from "./pages/CreatePost";
function Logout() {
	localStorage.clear();
	return <Navigate to="/login" />;
}
function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<PostPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="search/"
						element={
							<ProtectedRoute>
								<Search />
							</ProtectedRoute>
						}
					/>
					<Route
						path="edit_user/"
						element={
							<ProtectedRoute>
								<EditUser />
							</ProtectedRoute>
						}
					/>
					<Route
						path="edit_comment/"
						element={
							<ProtectedRoute>
								<EditComment />
							</ProtectedRoute>
						}
					/>
					<Route
						path="create_post/"
						element={
							<ProtectedRoute>
								<CreatePost />
							</ProtectedRoute>
						}
					/>
					<Route path="login/" element={<Login />} />
					<Route path="logout/" element={<Logout />} />
					<Route path="register/" element={<Register />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
