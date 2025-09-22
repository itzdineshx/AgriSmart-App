// Environment configuration validation
export const config = {
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_b3V0Z29pbmctY2hvdy0xOS5jbGVyay5hY2NvdW50cy5kZXYk",
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
export function validateConfig() {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.clerk.publishableKey) {
    errors.push("Missing Clerk publishable key");
  } else if (config.clerk.publishableKey.startsWith("pk_test_") && config.isProduction) {
    warnings.push("Using test Clerk key in production environment");
  }

  // Check if we're in a secure context for Clerk
  if (typeof window !== 'undefined') {
    if (!window.location.protocol.startsWith('https') && config.isProduction) {
      warnings.push("Clerk requires HTTPS in production");
    }
  }

  if (errors.length > 0) {
    console.error("Configuration errors:", errors);
  }
  
  if (warnings.length > 0) {
    console.warn("Configuration warnings:", warnings);
  }

  return errors.length === 0;
}

// Helper function to check if Clerk is likely blocked
export function isClerkBlocked(): boolean {
  try {
    // Check if common ad blocker patterns might be blocking Clerk
    const userAgent = navigator.userAgent.toLowerCase();
    const hasAdBlocker = (
      window.getComputedStyle ||
      !window.fetch ||
      typeof window.fetch !== 'function'
    );
    
    return false; // For now, just return false - we'll handle errors at runtime
  } catch {
    return true;
  }
}

export default config;