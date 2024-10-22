import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StudentList from "./StudentList"
import StudentDetail from "./StudentDetail";
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const Index = (props) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  useFocusEffect(
      useCallback(() => {
        props.iconRef?.current.play();
      }, [])
  );

  return (
    <Stack.Navigator initialRouteName="StudentList" screenOptions={props.screenOptions}>
      <Stack.Screen name="StudentList" component={StudentList} options={{title: t("students")}} />
      <Stack.Screen name="StudentDetailIndex" component={StudentDetail} options={{title: ""}}
                    initialParams={{screenOptions: props.screenOptions}} />
    </Stack.Navigator>
  );
}

export default Index;
