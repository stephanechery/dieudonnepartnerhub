import React from "react";
import ReactDOM from "react-dom/client";
import RootApp from "./RootApp";
import {
  applyPartnerDocumentTheme,
  getInitialPartnerDarkMode,
} from "./features/partner-dashboard/utils/theme";
import "./index.css";

applyPartnerDocumentTheme(getInitialPartnerDarkMode());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
