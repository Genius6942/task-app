import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = ({ dark = false }) => {
  return createTheme({
    palette: {
      type: dark ? "dark" : "light",
      mode: dark ? "dark" : "light",
      primary: createColor("#FF7B00"),
      secondary: createColor(dark ? "#FF0000" : "#E4FF00"),
      white: createColor("#FFFFFF"),
      black: createColor("#000000"),
      bgGrey: dark ? palette.grey[900] : palette.grey[300],
    },
  });
};

export default theme;
