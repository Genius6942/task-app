import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = ({ dark = false }) => {
  return createTheme({
    palette: {
      type: dark ? "dark" : "light",
      mode: dark ? "dark" : "light",
      primary: createColor("#FF6900"),
      secondary: createColor("#E4FF00"),
      white: createColor("#FFFFFF"),
    },
  });
};

export default theme;
