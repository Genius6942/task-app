import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const render = () =>
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// if (import.meta.env.DEV) {
if (true) {
  const script = document.createElement("script");
  script.src = "/eruda.js";
  document.body.appendChild(script);
  script.addEventListener("load", () => {
    const loader = document.createElement("script");
    loader.src = "/loadEruda.js";
    document.body.appendChild(loader);
    loader.addEventListener("load", () => {
      render();
      if ("serviceWorker" in navigator) {
        // Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
          (registration) => {
            console.log("Service worker registration succeeded:", registration);
          },
          /*catch*/ (error) => {
            console.error(`Service worker registration failed: ${error}`);
          }
        );
      } else {
        console.error("Service workers are not supported.");
      }
    });
  });
} else {
  render();
}
