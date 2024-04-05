import cookies from "js-cookie";
import { RESTAPI } from "../service/api";

const SESSION_COOKIE = "user";
const LANGUAGE_COOKIE = "Language";

export function getUserCookie() {
    let cookie = cookies.get(SESSION_COOKIE);
    return cookie ? JSON.parse(cookie) : undefined;
}

export function setUserCookie(user, time) {
    cookies.set(SESSION_COOKIE, JSON.stringify(user), time);

    if(!getLanguageCookie()){
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

const sessionModule = {
    state: () => ({
        user: getUserCookie(),
    }),
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        login({ user }) {
            return new Promise((resolve, reject) => {   
                RESTAPI.Login(user)
                    .then(response => {
                        if (response.status == 200 ||response.status == 204) {
                            if (user.rememberme) {
                                setUserCookie(response.data, 365);
                            }else{
                                setUserCookie(response.data);
                            }
                            resolve(response.data);
                        } else {
                            reject();
                        }
                    })
                    .catch(reject);
            });
        },
        logout() {
                removeUserCookie();
            return true;
        },
    },
};

export default sessionModule;