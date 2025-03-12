import axios from 'axios';

const api = axios.create({
    baseURL: 'http://54.221.98.15:8000', // Use o IP da sua instância EC2
});

export default api;
