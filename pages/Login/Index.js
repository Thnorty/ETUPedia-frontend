import {StyleSheet, View, TextInput} from "react-native";
import {useState, useRef} from "react";
import {Button} from "../../components/Components";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../utils/api";

const Index = ({navigation}) => {
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
      alert("Invalid email or password");
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
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
