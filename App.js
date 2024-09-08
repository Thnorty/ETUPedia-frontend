import Main from "./Main";
import "intl-pluralrules";
import "./utils/i18n";
import {useState} from "react";
import {ThemeProvider, lightTheme, darkTheme} from "./utils/Theme";

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Main setIsDarkTheme={setIsDarkTheme} />
    </ThemeProvider>
  );
}
