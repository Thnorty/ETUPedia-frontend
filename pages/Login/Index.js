import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {Button, TextInput} from "../../components/Components";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = ({navigation}) => {
  const [studentId, setStudentId] = useState("");

  const handleLogin = () => {
    alert(`Student ID: ${studentId}`);
    AsyncStorage.setItem('studentId', studentId)
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
