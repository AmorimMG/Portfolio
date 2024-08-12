import cookies from 'js-cookie';
// eslint-disable-next-line no-unused-vars
import { firebaseApp } from '../../firebase';
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const SESSION_COOKIE = 'user';
const LANGUAGE_COOKIE = 'Language';
const DARKTHEME_COOKIE = 'DarkTheme';

export function getUserCookie() {
    let cookie = cookies.get(SESSION_COOKIE);
    return cookie ? JSON.parse(cookie) : undefined;
}

export function setUserCookie(user, time) {
    cookies.set(SESSION_COOKIE, JSON.stringify(user), time);

    if (!getLanguageCookie()) {
        setLanguageCookie('en');
    }
}

function removeUserCookie() {
    cookies.remove(SESSION_COOKIE);
}

export function setLanguageCookie(language) {
    cookies.set(LANGUAGE_COOKIE, JSON.stringify(language));
}

export function getLanguageCookie() {
    let cookie = cookies.get(LANGUAGE_COOKIE);
    return cookie ? JSON.parse(cookie) : undefined;
}

export function setDarkThemeCookie(darktheme) {
    cookies.set(DARKTHEME_COOKIE, JSON.stringify(!darktheme));
}

export function getDarkThemeCookie() {
    let cookie = cookies.get(DARKTHEME_COOKIE);
    return cookie ? JSON.parse(cookie) : 'true';
}

const sessionModule = {
    actions: {
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
                    }
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
        }
    }
};

export default sessionModule;
