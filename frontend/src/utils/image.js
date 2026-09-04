const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API_ORIGIN =
  new URL(API_URL).origin;

export const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  // Backend object:
  // { url: "/uploads/image.jpg" }
  if (typeof image === "object") {
    image = image.url;
  }

  if (!image) {
    return "";
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Relative URL
  if (image.startsWith("/")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/${image}`;
};