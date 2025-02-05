import {createTheming} from "@callstack/react-theme-provider";
import defaultTheme from "@react-navigation/native/src/theming/DefaultTheme";

const lightTheme = {
  dark: false,
  colors: {
    primary: "#54a3ff",
    secondary: "#6C757D",
    background: "#F8F9FA",
    surface: "#EDEDED",
    primaryText: "#212529",
    secondaryText: "#5B6267",
    primaryTextInverted: "#FFFFFF",
    secondaryTextInverted: "#9EA1A3",
    accent: "#FFC107",
    error: "#DC3545",
    success: "#28A745",
    warning: "#FFC107",
    info: "#17A2B8",
    border: "#C7C7CC",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: "#0A84FF",
    secondary: "#6C757D",
    background: "#1C1C1E",
    surface: "#2C2C2E",
    primaryText: "#FFFFFF",
    secondaryText: "#9EA1A3",
    primaryTextInverted: "#000000",
    secondaryTextInverted: "#5B6267",
    accent: "#FFD60A",
    error: "#FF453A",
    success: "#34C759",
    warning: "#FFD60A",
    info: "#5AC8FA",
    border: "#5b5b5e",
  },
};

const {ThemeProvider, withTheme, useTheme} = createTheming(defaultTheme);

export {ThemeProvider, withTheme, useTheme, lightTheme, darkTheme};
