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

  if (!config.clerk.publishableKey) {
    errors.push("Missing Clerk publishable key");
  }

  if (errors.length > 0) {
    console.warn("Configuration warnings:", errors);
  }

  return errors.length === 0;
}

export default config;