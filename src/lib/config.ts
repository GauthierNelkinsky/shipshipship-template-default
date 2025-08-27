/**
 * Environment configuration for the frontend application
 * Handles API URL and JWT token configuration
 */

interface Config {
  apiUrl: string;
  isExternalApi: boolean;
}

/**
 * Get the API base URL from environment variables or default to relative URL
 */
function getApiUrl(): string {
  // Check for environment variable first
  const envApiUrl = import.meta.env.VITE_ADMIN_API_URL;

  if (envApiUrl) {
    // Remove trailing slash if present
    return envApiUrl.replace(/\/$/, "");
  }

  // Default to relative API path (current behavior)
  return "";
}

/**
 * Check if we're using an external API (different domain/port)
 */

function isExternalApi(): boolean {
  const apiUrl = getApiUrl();
  return apiUrl !== "" && !apiUrl.startsWith("/");
}

/**
 * Application configuration object
 */
export const config: Config = {
  apiUrl: getApiUrl(),
  isExternalApi: isExternalApi(),
};

/**
 * Get the full API endpoint URL
 */
export function getApiEndpoint(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (config.apiUrl) {
    return `${config.apiUrl}/api${normalizedPath}`;
  }

  // Default behavior - relative to current origin
  return `/api${normalizedPath}`;
}

/**
 * Get authentication headers for API requests
 * Note: For security, JWT tokens should be handled server-side
 * This is a placeholder for future secure authentication implementation
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  // TODO: Implement secure authentication
  // Options:
  // 1. Server-side proxy with JWT
  // 2. Session-based authentication
  // 3. OAuth flow with httpOnly cookies

  return headers;
}

/**
 * Development helper to log configuration
 */
export function logConfig(): void {
  if (import.meta.env.DEV) {
    console.log("🔧 Frontend Configuration:", {
      apiUrl: config.apiUrl || "(relative)",
      isExternalApi: config.isExternalApi,
      authMethod: "server-side (secure)",
    });
  }
}
