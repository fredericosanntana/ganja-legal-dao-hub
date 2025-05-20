
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./hooks/use-auth";
import { BrowserRouter } from "react-router-dom";
import { updateExistingSubscriptionsStatus } from "./services/authService";

// Update existing subscription statuses to inactive
updateExistingSubscriptionsStatus().then(success => {
  if (success) {
    console.log('Existing subscription statuses updated successfully');
  } else {
    console.warn('Failed to update existing subscription statuses');
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
