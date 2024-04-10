import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LessonList from "./LessonList";
import LessonDetail from "./LessonDetail";

const Index = ({navigation}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="LessonList" screenOptions={{headerShown: false}}>
      <Stack.Screen name="LessonList" component={LessonList} />
      <Stack.Screen name="LessonDetailIndex" component={LessonDetail} />
    </Stack.Navigator>
  );
}

export default Index;
