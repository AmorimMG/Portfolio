import axios from 'axios';
import Endpoints from './endpoints';
import { getUserCookie, removeUserCookie } from './session';

const isLocalhost = () => {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }
    return false;
};

const localhost = false//isLocalhost();
const baseURL = localhost ? 'http://localhost:4000' : 'https://api.amorim.pro';

const instance = axios.create({
    baseURL: baseURL
});

//Request Interceptor
instance.interceptors.request.use(
    async (config) => {
        const user = getUserCookie();

        if (user?.id && user.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Toast Error Handler
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            removeUserCookie();
            window.location.href = '/login';
        }

        /* 		 const toastService = ToastService();
		 if (toastService) {
		     toastService.add({
		         severity: 'error',
		         summary: error.message || error,
		         detail: error.response.data || error,
		         life: 3000
		     });
		 } */
        return Promise.reject(error);
    }
);

const RESTAPI = {
    ...Endpoints(instance)
};

export { baseURL, RESTAPI };
export default instance;
