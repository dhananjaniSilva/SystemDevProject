import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PopContextProvider from "./contexts/PopContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PopContextProvider>
      <App />
    </PopContextProvider>
  </React.StrictMode>
);
