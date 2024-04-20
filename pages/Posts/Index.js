import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostList from "./PostList";

const Index = ({navigation}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Posts" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Posts" component={PostList} />
      {/*<Stack.Screen name="PostDetailIndex" component={PostDetail} />*/}
    </Stack.Navigator>
  );
}

export default Index;
