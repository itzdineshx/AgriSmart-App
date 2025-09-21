import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { config, validateConfig } from "./lib/config";

// Validate configuration
validateConfig();

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={config.clerk.publishableKey}
    appearance={{
      baseTheme: undefined,
      variables: {
        colorPrimary: "hsl(142.1 76.2% 36.3%)",
      },
    }}
  >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ClerkProvider>
);
