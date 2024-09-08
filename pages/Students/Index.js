import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StudentList from "./StudentList"
import StudentDetail from "./StudentDetail";

const Index = (props) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="StudentList" screenOptions={props.screenOptions}>
      <Stack.Screen name="StudentList" component={StudentList} options={{title: t("students")}} />
      <Stack.Screen name="StudentDetailIndex" component={StudentDetail} options={{title: ""}}
                    initialParams={{screenOptions: props.screenOptions}} />
    </Stack.Navigator>
  );
}

export default Index;
