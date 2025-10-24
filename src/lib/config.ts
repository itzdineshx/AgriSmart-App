// Environment configuration validation
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
export function validateConfig() {
  const errors: string[] = [];
  const warnings: string[] = [];

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