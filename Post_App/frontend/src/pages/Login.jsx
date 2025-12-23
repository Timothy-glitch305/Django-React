import Form from "../components/Form";
function Login() {
	return <Form route={"auth/token/obtain/"} method={"login"} />;
}
export default Login;
