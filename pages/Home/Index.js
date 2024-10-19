import {useTranslation} from "react-i18next";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./Home";

const Index = (props) => {
  const {t} = useTranslation();
  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator initialRouteName="Forums" screenOptions={props.screenOptions}>
        <Stack.Screen name="Home" component={Home} options={{title: t("home")}} initialParams={props} />
      </Stack.Navigator>
  );
}

export default Index;
