import {CommonActions} from "@react-navigation/native";

export const resetStartToTargetScreen = (navigation, targetRouteName) => {
  navigation.dispatch(state => {
    const studentListRoute = state.routes.find(r => r.name === targetRouteName);
    const routes = [studentListRoute ? studentListRoute : {name: targetRouteName}, state.routes[state.routes.length - 1]];

    return CommonActions.reset({
      ...state,
      routes,
      index: routes.length - 1,
    });
  });
};
