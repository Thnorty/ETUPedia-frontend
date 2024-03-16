import {StyleSheet, Text, View} from "react-native";
import Button from "../../components/Button";
import {useEffect, useState} from "react";
import api from "../../utils/api";

export default function index() {
  const [helloWorld, setHelloWorld] = useState("");

  useEffect(() => {
    api.get("hello-world/")
      .then(response => response.data)
      .then(data => setHelloWorld(data.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>{helloWorld}</Text>
      <Button title="Press me" onPress={() => alert('Button pressed')} />
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
