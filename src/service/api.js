import axios from 'axios';
import Endpoints from './endpoints';

const baseURL = 'http://localhost:5050/';

const instance = axios.create({
    baseURL: baseURL
});

const RESTAPI = {
    ...Endpoints(instance)
};

export { RESTAPI, baseURL };
export default instance;
