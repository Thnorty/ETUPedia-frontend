import axios from 'axios';
import {localStorage} from "./LocalStorage";
import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking';
import Constants from 'expo-constants';

const backend = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'App-Version': Constants.expoConfig.version,
  }
});

export const setAxiosToken = (token) => {
  backend.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export const clearCookies = () => {
  RCTNetworking.clearCookies((result) => {
    if (result) {
      console.log('Cookies cleared successfully');
    } else {
      console.error('Cookie clear failed');
    }
  });
}

localStorage.load({key: 'token'}).then((token) => {
  setAxiosToken(token);
}).catch(() => {
  setAxiosToken("");
});

export default backend;
