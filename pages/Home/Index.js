import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./Home";
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
    <Stack.Navigator initialRouteName="Home" screenOptions={props.screenOptions}>
      <Stack.Screen name="Home" component={Home} options={{title: t("home")}} initialParams={props} />
    </Stack.Navigator>
  );
}

export default Index;
