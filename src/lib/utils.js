import { useWindowSize } from "react-use";
import { app_name } from "./constants";

/**
 * @param {string?} page
 */
const setDocumentTitle = (page) => {
  const dev = import.meta.env.DEV;
  const title = (dev ? "(DEV) " : "") + app_name + (page ? " | " + page : "");

  document.title = title;

  return title;
};

const useSmallScreen = (smallSize = 600) => {
  const { width } = useWindowSize();
  return width <= smallSize;
};

const hideSplash = () => {
  document.getElementById("splash").style.display = "none";
};

const useForceUpdate = () => {
  const [update, setUpdate] = useState(0);
  return () => setUpdate(update + 1);
};

export { setDocumentTitle, useSmallScreen, hideSplash, useForceUpdate };
