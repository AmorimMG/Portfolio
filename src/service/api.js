import axios from 'axios';
import ToastService from 'primevue/toastservice';
import Endpoints from './endpoints';

var baseURL = '';

if (window.location.hostname === 'amorim.pro') {
    baseURL = 'https://api.amorim.pro/';
} else {
    baseURL = 'http://localhost:4000/';
}

const instance = axios.create({
    baseURL: baseURL
});


//Toast Error Handler
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		 const toastService = ToastService();
		 if (toastService) {
		     toastService.add({
		         severity: 'error',
		         summary: error.message || error,
		         detail: error.response.data || error,
		         life: 3000
		     });
		 }
		return Promise.reject(error);
	},
);


const RESTAPI = {
    ...Endpoints(instance)
};

export { RESTAPI, baseURL };
export default instance;
