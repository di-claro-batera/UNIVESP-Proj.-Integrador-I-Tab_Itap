import axios from "axios";

/*const api = axios.create({
    baseURL: 'http://192.168.1.212:8000',
});
*/

const api = axios.create({
    baseURL: 'http://34.204.0.12:8000', // Substitua pelo IP da sua instância EC2 e porta
});

export default api;