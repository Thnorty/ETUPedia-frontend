import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginPage from "./LoginPage";
import InputStudentID from "./InputStudentID"
import FillEmail from "./FillEmail";

const Index = (props) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator initialRouteName="LoginPage" screenOptions={{...props.screenOptions, headerShown: false}}>
        <Stack.Screen name="LoginPage" options={{title: t("login")}}>
          {(screenProps) => <LoginPage {...screenProps} getStudentInfo={props.getStudentInfo} />}
        </Stack.Screen>
        <Stack.Screen name="InputStudentID" component={InputStudentID} options={{title: t("inputStudentID")}} />
        <Stack.Screen name="FillEmail" component={FillEmail} options={{title: t("fillEmail")}} />
      </Stack.Navigator>
  );
}

export default Index;
