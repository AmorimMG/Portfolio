import axios from 'axios';
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

const RESTAPI = {
    ...Endpoints(instance)
};

export { RESTAPI, baseURL };
export default instance;
