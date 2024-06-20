import {useTranslation} from "react-i18next";
import {StyleSheet, View, TextInput, Image} from "react-native";
import {useState, useRef} from "react";
import {Button} from "../../components/Components";
import backend, {setAxiosToken} from "../../utils/Backend";
import etupediaIcon from "../../assets/etupedia.png";
import {localStorage} from "../../utils/LocalStorage";
import axios from "axios";

const Index = (props) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const handleLogin = () => {
    const loginURL = "https://ubs.etu.edu.tr/login.aspx?lang=tr-TR";
    const loginData = {
      '__VIEWSTATE': '/wEPDwUKLTkzNDk1ODgzOA9kFgICAw9kFgwCCQ8PFgIeCEltYWdlVXJsBRR+L011c3RlcmlMb2dvLzYxLnBuZ2RkAhU' +
                      'PD2QWAh4MYXV0b2NvbXBsZXRlBQJvbmQCGQ8PZBYCHwEFAm9uZAInDw8WAh4HRW5hYmxlZGhkZAIrDxYCHgdWaXNpYm' +
                      'xlaGQCLQ9kFgICAQ8PFgIeBFRleHRlZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFDUltYWdlQ' +
                      'nV0dG9uVFIFDUltYWdlQnV0dG9uRU6G8CXMQsZDt5IZGuMgTsIlSy3kDg==',
      '__EVENTVALIDATION': '/wEWBgKjkPDYBALvqPO+AgLjqJ+WBQKG87HkBgK1qbSRCwKC3IeGDOWeHvaR4DQVjutZAzChsKm4TchX',
      'txtLogin': email,
      'txtPassword': password,
      'btnLogin': 'Giriş'
    }

    axios.post(loginURL, new URLSearchParams(loginData)).then((response) => {
      const responseURL = response.request.responseURL;
      if (responseURL === loginURL) {
        alert(t("invalidLogin"));
      } else {
        const payload = {
          email: email
        }
        backend.post("api/login/", payload).then((response) => {
          localStorage.save({key: 'studentId', data: response.data.student_id}).then().catch((error) => console.error(error));
          localStorage.save({key: 'token', data: response.data.token}).then(() => {
            setAxiosToken(response.data.token);
            props.getStudentInfo(response.data.student_id, props.navigation);
          }).catch((error) => console.error(error));
        });
      }
    }).catch((error) => {
      console.error(error);
      alert(t("invalidLogin"));
    });
  }

  return (
    <View style={styles.container}>
      <Image source={etupediaIcon} style={{width: 140, height: 140, marginBottom: 40, borderRadius: 16}} />
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current.focus()}
        autoCapitalize={"none"}
        autoComplete={"email"}
        style={styles.input}
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
