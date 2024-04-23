import { RESTAPI } from './api';

export default function() {
    return new Promise((resolve, reject) => {
        RESTAPI.ObterDiscord()
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}