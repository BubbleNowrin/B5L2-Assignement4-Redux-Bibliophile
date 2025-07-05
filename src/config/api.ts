// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    return "https://l2-b5-mongoose-express-type-script.vercel.app/api/";
  }

  // Development - use proxy
  return "/api/";
};

export const API_BASE_URL = getApiBaseUrl();
