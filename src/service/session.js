import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import cookies from "js-cookie";
import { RESTAPI } from "./api";
// eslint-disable-next-line no-unused-vars

const auth = getAuth();
const SESSION_COOKIE = "user";
const LANGUAGE_COOKIE = "Language";
const DARKTHEME_COOKIE = "DarkTheme";

export function getUserCookie() {
	const cookie = cookies.get(SESSION_COOKIE);
	return cookie ? JSON.parse(cookie) : undefined;
}

export function setUserCookie(user, time) {
	cookies.set(SESSION_COOKIE, JSON.stringify(user), time);
	if (!getLanguageCookie()) {
		setLanguageCookie("pt");
	}
}

export function removeUserCookie() {
	cookies.remove(SESSION_COOKIE);
}

export function setLanguageCookie(language) {
	cookies.set(LANGUAGE_COOKIE, JSON.stringify(language));
}

export function getLanguageCookie() {
	const cookie = cookies.get(LANGUAGE_COOKIE);
	return cookie ? JSON.parse(cookie) : undefined;
}

export function setDarkThemeCookie(darktheme) {
	cookies.set(DARKTHEME_COOKIE, JSON.stringify(!darktheme));
}

export function getDarkThemeCookie() {
	const cookie = cookies.get(DARKTHEME_COOKIE);
	return cookie ? JSON.parse(cookie) : "true";
}

const sessionModule = {
	actions: {
		/* //FireBase Login
        login({ user }) {
            return new Promise((resolve, reject) => {
                signInWithEmailAndPassword(auth, user.email, user.password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        resolve(user);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }, */
		login({ user }) {
			return new Promise((resolve, reject) => {
				RESTAPI.Login({
					usuario: user.usuario,
					senha: user.senha,
				})
					.then((response) => {
						const user = response.data;
						setUserCookie(user);
						resolve(user);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		isUserLogged() {
			return new Promise((resolve, reject) => {
				onAuthStateChanged(
					auth,
					(user) => {
						if (user) {
							resolve(true);
						} else {
							resolve(false);
						}
					},
					(error) => {
						reject(error);
					},
				);
			});
		},
		logout() {
			signOut(auth)
				.then(() => {
					return true;
				})
				.catch((error) => {
					console.log(error);
					return false;
				});
		},
	},
};

export default sessionModule;
