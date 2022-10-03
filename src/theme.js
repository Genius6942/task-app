import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = ({ dark = false }) => {
  return createTheme({
    palette: {
      type: dark ? "dark" : "light",
      mode: dark ? "dark" : "light",
      primary: {
        main: "#FF6900",
      },
      secondary: {
        main: "#E4FF00",
      },
    },
  });
};

export default theme;
