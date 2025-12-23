function UserBox({ upload }) {
	return (
		<div
			style={{
				border: "2px solid black",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "50dvh ",
				height: "5dvh",
			}}
		>
			<img
				src={upload.author_picture}
				style={{
					backgroundColor: "lightgray",
					objectFit: "cover",
					borderRadius: "50%",
					width: "3dvh",
					height: "3dvh",
				}}
			/>
			<h3 style={{ fontSize: "3dvh" }}>{upload.author_name}</h3>
		</div>
	);
}
export default UserBox;
