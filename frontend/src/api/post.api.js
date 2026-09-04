import api from "./axios";

export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get("/posts", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const createPost = async (formData) => {
  const response = await api.post("/posts", formData);

  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post(
    `/posts/${postId}/like`
  );

  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await api.post(
    `/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
};