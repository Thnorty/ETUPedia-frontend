import axios from 'axios';
import Storage from 'react-native-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: 'https://bass-flexible-freely.ngrok-free.app/',
});

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24
});

storage.load({key: 'token'}).then((token) => {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
});

export default api;
