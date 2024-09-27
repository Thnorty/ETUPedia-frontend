import {useTranslation} from "react-i18next";
import {StyleSheet, View, TextInput, Image} from "react-native";
import {useState, useRef} from "react";
import Button from "../../components/Button";
import backend, {clearCookies, setAxiosToken} from "../../utils/Backend";
import etupediaIcon from "../../assets/etupedia.png";
import {localStorage} from "../../utils/LocalStorage";
import axios from "axios";
import {useTheme} from "../../utils/Theme";
import Alert from "../../components/Alert";

const Index = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
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
    };

    axios.post(loginURL, new URLSearchParams(loginData)).then((response) => {
      const responseURL = response.request.responseURL;
      if (responseURL === loginURL) {
        throw new Error("Invalid login credentials");
      } else {
        axios.get("https://ubs.etu.edu.tr/Ogrenci/Ogr0413/Default.aspx?lang=tr-TR").then((response) => {
          const oturumNo = response.request.responseURL.split("oturumNo=")[1];
          clearCookies();
          const payload = {
            email: email,
            oturumNo: oturumNo,
          }
          backend.post("api/login/", payload).then((response) => {
            localStorage.save({key: 'studentId', data: response.data.student_id}).then().catch((error) => {
              console.error(error);
              setIsErrorAlertOpen(true);
            });
            localStorage.save({key: 'token', data: response.data.token}).then(() => {
              setAxiosToken(response.data.token);
              props.getStudentInfo(response.data.student_id, props.navigation);
            }).catch((error) => {
              console.error(error);
              setIsErrorAlertOpen(true);
            });
          });
        }).catch((error) => {
          console.error(error);
          setIsErrorAlertOpen(true);
        });
      }
    }).catch((error) => {
      console.error(error);
      setIsErrorAlertOpen(true);
    });
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Alert
        title={t("invalidLogin")}
        message={t("invalidLoginMessage")}
        buttons={[{text: t("okay"), onPress: () => setIsErrorAlertOpen(false)}]}
        isOpen={isErrorAlertOpen}
        setIsOpen={setIsErrorAlertOpen}
      />
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
