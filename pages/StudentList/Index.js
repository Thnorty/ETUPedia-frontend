import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StudentList from "./StudentList"
import StudentDetail from "./StudentDetail";

const Index = ({navigation}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="StudentList" screenOptions={{headerShown: false}}>
      <Stack.Screen name="StudentList" component={StudentList} />
      <Stack.Screen name="StudentDetailIndex" component={StudentDetail} />
    </Stack.Navigator>
  );
}

export default Index;
