import {useTranslation} from "react-i18next";
import {StyleSheet, View, TextInput, Image} from "react-native";
import {useState, useRef} from "react";
import {Button} from "../../components/Components";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../utils/api";
import icon from "../../assets/icon.png";

const Index = ({navigation}) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24
  })

  const handleLogin = () => {
    const payload = {
      email: email,
      password: password
    }
    api.post("login/", payload).then((response) => {
      storage.save({key: 'studentId', data: response.data.student_id}).then(() => {
        navigation.reset({index: 0, routes: [{ name: 'Home' }]});
      }).catch((error) => console.error(error));
    }).catch((error) => {
      console.error(error);
      alert(t("invalidLogin"));
    });
  }

  return (
    <View style={styles.container}>
      <Image source={icon} style={{width: 100, height: 100, marginBottom: 40, borderRadius: 16}} />
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={passwordRef}
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        style={styles.input}
      />
      <Button title={t("logIn")} onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  }
});

export default Index;
