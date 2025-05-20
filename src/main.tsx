
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./hooks/use-auth";
import { BrowserRouter } from "react-router-dom";
import { updateExistingSubscriptionsStatus } from "./services/authService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for React Query
const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
