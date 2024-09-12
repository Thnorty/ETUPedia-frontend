import {useTranslation} from "react-i18next";
import {StyleSheet, View, TextInput, Image} from "react-native";
import {useState, useRef} from "react";
import Button from "../../components/Button";
import backend, {setAxiosToken} from "../../utils/Backend";
import etupediaIcon from "../../assets/etupedia.png";
import {localStorage} from "../../utils/LocalStorage";
import axios from "axios";
import {useTheme} from "../../utils/Theme";

const Index = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const handleLogin = () => {
    const payload = {
      email: email,
      password: password
    }
    backend.post("api/login/", payload).then((response) => {
      localStorage.save({key: 'studentId', data: response.data.student_id}).then().catch((error) => console.error(error));
      localStorage.save({key: 'token', data: response.data.token}).then(() => {
        setAxiosToken(response.data.token);
        props.getStudentInfo(response.data.student_id, props.navigation);
      }).catch((error) => {
        alert(error);
        console.error(error);
      });
    });
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Image source={etupediaIcon} style={{width: 140, height: 140, marginBottom: 40, borderRadius: 16}} />
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current.focus()}
        autoCapitalize={"none"}
        autoComplete={"email"}
        style={[styles.input, {borderColor: theme.colors.border, color: theme.colors.primaryText}]}
        placeholderTextColor={theme.colors.secondaryText}
      />
      <TextInput
        ref={passwordRef}
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
        autoCapitalize={"none"}
        autoComplete={"current-password"}
        style={[styles.input, {borderColor: theme.colors.border, color: theme.colors.primaryText}]}
        placeholderTextColor={theme.colors.secondaryText}
      />
      <Button title={t("logIn")} onPress={handleLogin} style={{backgroundColor: theme.colors.primary}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  }
});

export default Index;
