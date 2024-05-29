import axios from 'axios';
import {localStorage} from "./LocalStorage";
require('dotenv').config();

const backend = axios.create({
  baseURL: process.env.BASE_URL,
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
