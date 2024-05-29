import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LessonList from "./LessonList";
import LessonDetail from "./LessonDetail";

const Index = ({navigation}) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="LessonList">
      <Stack.Screen name="LessonList" component={LessonList} options={{title: t("lessons")}}  />
      <Stack.Screen name="LessonDetailIndex" component={LessonDetail} options={{title: ""}}  />
    </Stack.Navigator>
  );
}

export default Index;