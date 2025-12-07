const baseURL = 'http://127.0.0.1:8000/api/';

export const environment = {
  version: '0.1',
  production: false,
  userLogin: `${baseURL}auth/user/login`,
  fypPosts: `${baseURL}fyp/posts`,
  hashtags: `${baseURL}fyp/hashtags`,
  createPost: `${baseURL}fyp/posts/store`,
  
  toggleLikePost: (postId: number) => `${baseURL}fyp/posts/toggle/like/${postId}`,
  toggleSavePost: (postId: number) => `${baseURL}fyp/posts/toggle/save/${postId}`,
};
