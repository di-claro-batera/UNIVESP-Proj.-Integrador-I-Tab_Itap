import axios from 'axios';

const api = axios.create({
    baseURL: 'http://34.204.0.12:8000', // Use o novo IP da instância EC2
});

export default api;
