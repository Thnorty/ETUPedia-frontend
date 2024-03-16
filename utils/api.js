import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bass-flexible-freely.ngrok-free.app/api/',
});

export default api;
