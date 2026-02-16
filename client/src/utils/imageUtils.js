export const getImageUrl = (path) => {
  if (!path) return "";
  // If path is already a full URL, return it
  if (path.startsWith("http")) return path;

  const baseUrl = import.meta.env.VITE_URL || "";

  // Clean the path (remove leading slash)
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Combine base URL and path, ensuring no double slashes
  return baseUrl ? `${baseUrl}/${cleanPath}` : `/${cleanPath}`;
};
