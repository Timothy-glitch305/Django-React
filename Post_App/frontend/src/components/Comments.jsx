import { useState, useEffect } from "react";
import api from "../api";
import UserBox from "./User";
import LoadingIndicator from "./LoadingIndicator";
import plus from "../assets/plus.svg";
import edit from "../assets/pencil.png";
import like from "../assets/like.png";
import unlike from "../assets/unlike.jpg";
import trashcan from "../assets/delete.png";
import cancel from "../assets/cancel.png";
import save from "../assets/save.jpg";
import comment from "../assets/comment.png";
import "../styles/Comment.css";

function Comments({ postid }) {
	const [showComments, setShowComments] = useState(true);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editedData, setEditedData] = useState({ content: "" });
	const [editID, setEditID] = useState(null);

	useEffect(() => {
		getComments();
	}, []);

	const getComments = async () => {
		try {
			setLoading(true);
			const res = await api.get(`posts/${postid}/comments/`);
			setComments(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const likeComment = async (commentId) => {
		try {
			setLoading(true);
			await api.post(`posts/${postid}/comments/${commentId}/likes/`);
			await getComments();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const unLikeComment = async (commentId) => {
		try {
			setLoading(true);
			await api.post(`posts/${postid}/comments/${commentId}/unlike/`);
			await getComments();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const deleteComment = async (commentId) => {
		try {
			setLoading(true);
			await api.delete(`posts/${postid}/comments/${commentId}/`);
			await getComments();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const handleCancel = () => {
		setEditedData({ content: "" });
		setEditID(null);
	};
	const handleSave = async () => {
		try {
			setLoading(true);
			await api.patch(`posts/${postid}/comments/${editID}/`, {
				content: editedData.content,
			});
			await getComments();
			setEditID(null);
			setEditedData({ content: "" });
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const handleChanges = (e) => {
		setEditedData({ content: e.target.value });
	};
	const handleEditClick = (comment) => {
		setEditID(comment.id);
		setEditedData({ content: comment.content });
	};
	return (
		<div>
			<button
				onClick={() => setShowComments(!showComments)}
				disabled={loading}
			>
				<img src={comment} />
			</button>
			{/* Kommentare anzeigen */}
			<div hidden={showComments}>
				<ul>
					{comments.map((c) => (
						<li
							key={c.id}
							style={{
								border: "1px solid black",
								marginTop: "10px",
							}}
						>
							<UserBox upload={c} />{" "}
							{editID == c.id ? (
								<input
									type="text"
									value={
										editID == c.id
											? editedData.content
											: c.content
									}
									onChange={handleChanges}
								/>
							) : (
								<p>{c.content}</p>
							)}
							<p>
								{" "}
								{new Date(c.created_at).toLocaleString(
									"de-DE",
									{
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									}
								)}{" "}
								<br />
								Likes: {c.likes_count}
							</p>
							<br />
							{!c.can_edit &&
								(c.liked_by_me ? (
									<button onClick={() => unLikeComment(c.id)}>
										<img src={unlike} />
									</button>
								) : (
									<button onClick={() => likeComment(c.id)}>
										<img src={like} />
									</button>
								))}
							{c.can_edit && (
								<>
									<button onClick={() => deleteComment(c.id)}>
										<img src={trashcan} />
									</button>
									{editID == c.id ? (
										<>
											<button
												onClick={() => handleCancel()}
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
											onClick={() => handleEditClick(c)}
										>
											<img src={edit} />
										</button>
									)}
								</>
							)}
						</li>
					))}
				</ul>
				<CreateComment postid={postid} getComments={getComments} />
			</div>
			{loading && <LoadingIndicator />}
		</div>
	);
}

export default Comments;

function CreateComment({ postid, getComments }) {
	const [formData, setFormData] = useState({ content: "" });
	const [loading, setLoading] = useState(false);

	const create = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (formData.content)
			await api.post(`posts/${postid}/comments/`, {
				content: formData.content,
			});
		await getComments();
		setFormData({ content: "" });
		setLoading(false);
	};
	return (
		<form onSubmit={create}>
			<input
				type="text"
				onChange={(e) => setFormData({ content: e.target.value })}
				value={formData.content}
			/>
			<button type="submit">
				<img src={plus} className="create" />
			</button>
			{loading && <LoadingIndicator />}
		</form>
	);
}
