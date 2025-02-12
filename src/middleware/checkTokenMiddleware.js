import { getUserCookie } from "../service/session";

// Function to decode the JWT token
function decodeJWT(token) {
	const base64Url = token.split(".")[1]; // Get the payload part
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
			.join(""),
	);

	return JSON.parse(jsonPayload);
}

export default async function checkTokenMiddleware(to, from, next) {
	const path = to.fullPath ? to.path : null;
	if (path.includes("/cadastros") || path.includes("/consultas")) {
		return next();
	}

	const user = getUserCookie();
	if (user?.access_token) {
		const decodedToken = decodeJWT(user.access_token);
		if (decodedToken.exp * 1000 > Date.now()) {
			console.log("token é valido to chamando o middleware");
			/*       await sessionModule.actions.renewToken(); */
		} else {
			console.log("Token expirado");
			return next("/login");
		}
	} else {
		console.log("Usuário ou token não existe");
		return next("/login");
	}

	next();
}
