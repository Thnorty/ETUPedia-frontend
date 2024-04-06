import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TeacherList from "./TeacherList";
import TeacherDetail from "./TeacherDetail";

const Index = ({navigation}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="TeacherList" screenOptions={{headerShown: false}}>
      <Stack.Screen name="TeacherList" component={TeacherList} />
      <Stack.Screen name="TeacherDetailIndex" component={TeacherDetail} />
    </Stack.Navigator>
  );
}

export default Index;
