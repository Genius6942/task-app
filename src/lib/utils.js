import { useWindowSize } from "react-use";

/**
 * @param {string?} page
 */
const setDocumentTitle = (page) => {
  const dev = import.meta.env.DEV;
  const title = (dev ? "(DEV) " : "") + "doit" + (page ? " | " + page : "");

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

export { setDocumentTitle, useSmallScreen, hideSplash };
