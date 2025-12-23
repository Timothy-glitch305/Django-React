import Post from "../components/Post";
import "../styles/Home.css";
function PostPage() {
	return (
		<div className="container">
			<Post mode="load" />
			<a href="/create_post/" className="link">
				Hier Posts erstellen
			</a>
			<hr />
			<a href="/logout" className="link">
				Logout
			</a>
		</div>
	);
}
export default PostPage;
