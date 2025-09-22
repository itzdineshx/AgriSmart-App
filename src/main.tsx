import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ClerkErrorBoundary } from "./components/ClerkErrorBoundary";
import { config, validateConfig } from "./lib/config";

// Validate configuration
validateConfig();

createRoot(document.getElementById("root")!).render(
  <ClerkErrorBoundary>
    <ClerkProvider 
      publishableKey={config.clerk.publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(142.1 76.2% 36.3%)",
        },
      }}
      telemetry={false}
      experimental={{
        disableLoadingScreens: false,
      }}
      localization={{
        signIn: {
          start: {
            title: "Sign in to AgriSmart",
            subtitle: "Welcome back! Please sign in to continue."
          }
        },
        signUp: {
          start: {
            title: "Create your AgriSmart account",
            subtitle: "Get started with smart farming solutions."
          }
        }
      }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </ClerkErrorBoundary>
);
