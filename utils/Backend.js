import axios from 'axios';
import {localStorage} from "./LocalStorage";

const backend = axios.create({
  baseURL: 'https://bass-flexible-freely.ngrok-free.app/',
});

export const setAxiosToken = (token) => {
  backend.defaults.headers.common['Authorization'] = `Token ${token}`;
}

localStorage.load({key: 'token'}).then((token) => {
  setAxiosToken(token);
}).catch(() => {
  setAxiosToken("");
});

export default backend;
