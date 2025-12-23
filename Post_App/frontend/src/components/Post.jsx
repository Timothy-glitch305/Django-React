import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import UserBox from "./User";
import Comments from "./Comments";
import LoadingIndicator from "./LoadingIndicator";
import plus from "../assets/plus.svg";
import edit from "../assets/pencil.png";
import like from "../assets/like.png";
import unlike from "../assets/unlike.jpg";
import trashcan from "../assets/delete.png";
import cancel from "../assets/cancel.png";
import save from "../assets/save.jpg";
function Post({ mode = "load" }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({ caption: "", content: "" });
	const [updateData, setUpdateData] = useState({});
	const [editID, setEditID] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (mode == "load") {
			getPosts();
		}
	}, [mode]);

	const getPosts = async () => {
		setLoading(true);
		try {
			const res = await api.get("posts/");
			let data = res.data;
			data.sort((a, b) => b.likes_count - a.likes_count);
			setData(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const createPosts = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post("posts/", formData);
			await getPosts(); // optional: Liste nach dem Erstellen neu laden
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
		navigate("/");
	};
	const handleEditClick = (post) => {
		setEditID(post.id);
		setUpdateData({ caption: post.caption, content: post.content });
	};
	const handleCancel = () => {
		setEditID(null);
		setUpdateData({});
	};
	const handleSave = async () => {
		setLoading(true);
		try {
			await api.patch(`posts/${editID}/`, updateData);
			await getPosts();
			setEditID(null);
			setUpdateData({});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setUpdateData({ ...updateData, [e.target.name]: e.target.value });
	};

	const likepost = async (postid) => {
		setLoading(true);
		await api.post(`posts/${postid}/likes/`);
		await getPosts();
		setLoading(false);
	};

	const deletePosts = async (PostId) => {
		if (!PostId) return;
		setLoading(true);
		try {
			await api.delete(`posts/${PostId}/`);
			setData([]); // optional: leeren oder neu laden
			await getPosts();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const unlikepost = async (postid) => {
		setLoading(true);
		const res = await api.post(`/posts/${postid}/unlike/`);
		if (res.status === 400) {
			console.log("Error");
		}
		await getPosts();
		setLoading(false);
	};

	return (
		<>
			{mode === "load" && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{loading ? (
						<LoadingIndicator />
					) : (
						data.map((post) => (
							<div key={post.id}>
								<UserBox upload={post} />
								<div style={{ display: "flex" }}>
									<input
										name="caption"
										onChange={handleChange}
										value={
											editID === post.id
												? updateData.caption
												: post.caption
										}
										readOnly={editID !== post.id}
									/>
									{editID === post.id ? (
										<textarea
											name="content"
											value={updateData.content}
											onChange={(e) => {
												setUpdateData({
													...updateData,
													content: e.target.value,
												});
												e.target.style.height = "auto";
												e.target.style.height = `${e.target.scrollHeight}px`;
											}}
											style={{
												width: "100%",
												resize: "none", // nicht ziehbar
												overflow: "hidden", // keine Scrollbars
												minHeight: "50px", // Start-Höhe
											}}
										/>
									) : (
										<p
											style={{
												whiteSpace: "pre-wrap",
												margin: 0,
												maxWidth: "45dvh",
											}}
										>
											{post.content}
										</p>
									)}
								</div>

								<p>
									{""}
									{new Date(
										post.created_at
									).toLocaleDateString("de-DE", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
									})}{" "}
									{new Date(
										post.created_at
									).toLocaleTimeString("de-DE", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
								<p>Likes: {post.likes_count}</p>
								<Comments postid={post.id} />
								<hr />
								{!post.can_edit &&
									(post.liked_by_me ? (
										<button
											onClick={() => unlikepost(post.id)}
										>
											<img src={unlike} />
										</button>
									) : (
										<button
											onClick={() => likepost(post.id)}
										>
											<img src={like} />
										</button>
									))}
								<hr />
								{post.can_edit && (
									<>
										<button
											onClick={() => deletePosts(post.id)}
										>
											<img src={trashcan} />
										</button>
										{editID === post.id ? (
											<>
												<button
													onClick={() =>
														handleCancel()
													}
												>
													<img src={cancel} />
												</button>
												<button
													onClick={() => handleSave()}
												>
													<img src={save} />
												</button>
											</>
										) : (
											<button
												onClick={() =>
													handleEditClick(post)
												}
											>
												<img src={edit} />
											</button>
										)}
									</>
								)}
							</div>
						))
					)}
					<br />
				</div>
			)}
			{mode === "create" && (
				<>
					<form onSubmit={createPosts}>
						<input
							name="caption"
							value={formData.caption}
							onChange={(e) =>
								setFormData({
									...formData,
									caption: e.target.value,
								})
							}
							placeholder="Caption"
						/>
						<textarea
							name="content"
							value={formData.content}
							onChange={(e) =>
								setFormData({
									...formData,
									content: e.target.value,
								})
							}
							placeholder="Content"
						/>
						<button type="submit">
							<img src={plus} />
						</button>
					</form>
					{loading && <LoadingIndicator />}
				</>
			)}
		</>
	);
}
export default Post;
