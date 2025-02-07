import Main from "./Main";
import "intl-pluralrules";
import "./utils/i18n";
import {useEffect, useState} from "react";
import {ThemeProvider, lightTheme, darkTheme} from "./utils/Theme";
import {useColorScheme} from 'react-native';
import {localStorage} from "./utils/LocalStorage";
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  const deviceTheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState("");

  useEffect(() => {
    localStorage.load({key: "colorScheme"}).then((colorScheme) => {
      setColorScheme(colorScheme);
    }).catch(() => {
      setColorScheme("systemDefault");
    });
  }, [deviceTheme]);

  if (colorScheme === "") return null;

  SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? darkTheme.colors.background : colorScheme === "light" ? lightTheme.colors.background : deviceTheme === "dark" ? darkTheme.colors.background : lightTheme.colors.background).then();
  NavigationBar.setBackgroundColorAsync("transparent").then();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemeProvider theme={colorScheme === "dark" ? darkTheme : colorScheme === "light" ? lightTheme : deviceTheme === "dark" ? darkTheme : lightTheme}>
        <Main colorScheme={colorScheme} setColorScheme={setColorScheme} />
      </ThemeProvider>
    </SafeAreaView>
  );
}
