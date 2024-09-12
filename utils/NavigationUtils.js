import {CommonActions} from "@react-navigation/native";

export const resetStartToTargetScreen = (navigation, targetRouteName) => {
  navigation.dispatch(state => {
    const targetRoute = state.routes.find(r => r.name === targetRouteName);
    const routes = [targetRoute ? targetRoute : {name: targetRouteName}, state.routes[state.routes.length - 1]];

    return CommonActions.reset({
      ...state,
      routes,
      index: routes.length - 1,
    });
  });
};
