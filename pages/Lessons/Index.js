import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LessonList from "./LessonList";
import LessonDetail from "./LessonDetail";
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
    <Stack.Navigator initialRouteName="LessonList" screenOptions={props.screenOptions}>
      <Stack.Screen name="LessonList" component={LessonList} options={{title: t("lessons")}} />
      <Stack.Screen name="LessonDetailIndex" component={LessonDetail} options={{title: ""}}
                    initialParams={{screenOptions: props.screenOptions}} />
    </Stack.Navigator>
  );
}

export default Index;
