import {colorKit} from "reanimated-color-picker";

export const getTextColor = (backgroundColor) => {
  return !backgroundColor || colorKit.getLuminanceWCAG(backgroundColor) > 0.179 ? "black" : "white";
};
