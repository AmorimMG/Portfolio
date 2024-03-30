import axios from 'axios';
import Endpoints from './endpoints';

const baseURL = 'http://localhost:5050/';

const instance = axios.create({
    baseURL: baseURL
});

const M3AI_RESTAPI = {
    ...Endpoints(instance)
};

export { M3AI_RESTAPI, baseURL }; // Export baseURL
export default instance;
