import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {Button, TextInput} from "../../components/Components";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = ({navigation}) => {
  const [studentId, setStudentId] = useState("");
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24
  })

  const handleLogin = () => {
    alert(`Student ID: ${studentId}`);
    storage.save({key: 'studentId', data: studentId})
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }).catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        onSubmitEditing={handleLogin}
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
});

export default Index;
