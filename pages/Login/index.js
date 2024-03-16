import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {Button, TextInput} from "../../components/components";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const [studentId, setStudentId] = useState("");
  const handleLogin = () => {
    alert(`Student ID: ${studentId}`);
    AsyncStorage.setItem('studentId', studentId);
  }
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
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
