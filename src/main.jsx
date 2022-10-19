import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App";
import "./index.css";

const render = () =>
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);

if (import.meta.env.DEV && !localStorage.getItem("no-eruda")) {
  // if (true) {
  const script = document.createElement("script");
  script.src = "/eruda.js";
  document.body.appendChild(script);
  script.addEventListener("load", () => {
    const loader = document.createElement("script");
    loader.src = "/loadEruda.js";
    document.body.appendChild(loader);
    loader.addEventListener("load", () => {
      render();
    });
  });
} else {
  render();
}
