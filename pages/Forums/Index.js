import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
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
    <Stack.Navigator initialRouteName="Forums" screenOptions={props.screenOptions}>
      <Stack.Screen name="Forums" component={PostList} options={{title: t("forums")}} />
      <Stack.Screen name="ForumDetailIndex" component={PostDetail} />
    </Stack.Navigator>
  );
}

export default Index;
