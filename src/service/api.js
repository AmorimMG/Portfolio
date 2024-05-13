import axios from 'axios';
import Endpoints from './endpoints';

var baseURL = '';

if (window.location.hostname === 'amorim.pro') {
    baseURL = 'http://192.168.0.190:5001/';
} else {
    baseURL = 'http://localhost:4000/';
}

const instance = axios.create({
    baseURL: baseURL
});

const RESTAPI = {
    ...Endpoints(instance)
};

export { RESTAPI, baseURL };
export default instance;
