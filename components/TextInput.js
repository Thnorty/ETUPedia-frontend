import { TextInput as RNTextInput, StyleSheet } from 'react-native';

const TextInput = (props) => {
  return <RNTextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  },
});

export default TextInput;
