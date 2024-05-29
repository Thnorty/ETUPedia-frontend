import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";

export const localStorage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
});
