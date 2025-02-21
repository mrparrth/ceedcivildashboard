import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("app");
const root = createRoot(container);

//removed react strict mode
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
