import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import {useTranslation} from "react-i18next";

const Index = ({navigation}) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Forums">
      <Stack.Screen name="Forums" component={PostList} options={{title: t("forums")}} />
      <Stack.Screen name="ForumDetailIndex" component={PostDetail} />
    </Stack.Navigator>
  );
}

export default Index;
