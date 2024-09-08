import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TeacherList from "./TeacherList";
import TeacherDetail from "./TeacherDetail";

const Index = (props) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="TeacherList" screenOptions={props.screenOptions}>
      <Stack.Screen name="TeacherList" component={TeacherList} options={{title: t("teachers")}} />
      <Stack.Screen name="TeacherDetailIndex" component={TeacherDetail} options={{title: ""}}
                    initialParams={{screenOptions: props.screenOptions}} />
    </Stack.Navigator>
  );
}

export default Index;
