import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress browser extension errors (harmless, caused by extensions like React DevTools)
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    // Filter out browser extension errors
    if (
      message.includes("Could not establish connection") ||
      message.includes("Receiving end does not exist") ||
      message.includes("runtime.lastError") ||
      message.includes("message channel closed")
    ) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
