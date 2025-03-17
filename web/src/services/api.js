import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Usa a variável de ambiente
});

export default api;