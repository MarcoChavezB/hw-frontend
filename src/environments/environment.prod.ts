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
  postByUser: (userId: number) => `${baseURL}fyp/posts/${userId}`,
  postLikedByUser: (userId: number) => `${baseURL}fyp/post/profile/likes/${userId}`,
  postSavedByUser: (userId: number) => `${baseURL}fyp/post/profile/saved/${userId}`,
  postCommentStore: (postId: number) => `${baseURL}comments/store/${postId}`
};
