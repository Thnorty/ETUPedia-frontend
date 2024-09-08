import Main from "./Main";
import "intl-pluralrules";
import "./utils/i18n";
import {useEffect, useState} from "react";
import {ThemeProvider, lightTheme, darkTheme} from "./utils/Theme";
import {useColorScheme} from "react-native";
import {localStorage} from "./utils/LocalStorage";

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

  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : colorScheme === "light" ? lightTheme : deviceTheme === "dark" ? darkTheme : lightTheme}>
      <Main colorScheme={colorScheme} setColorScheme={setColorScheme} />
    </ThemeProvider>
  );
}
