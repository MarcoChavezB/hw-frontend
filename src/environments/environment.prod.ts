//const baseURL = 'http://127.0.0.1:8000/api/';
const baseURL = 'https://hw-api.on-forge.com/api/';

export const environment = {
  version: '1.2.3',
    versionCheck: `${baseURL}version`,

  production: false,
  userLogin: `${baseURL}auth/user/login`,
  fypPosts: `${baseURL}fyp/posts`,
  hashtags: `${baseURL}fyp/hashtags`,
  createPost: `${baseURL}fyp/posts/store`,
  userRegister: `${baseURL}auth/register`,
  verifyEmail: `${baseURL}auth/verify-email`,  
  getUserNamesList: `${baseURL}auth/users/names`,
  
  toggleLikePost: (postId: number) => `${baseURL}fyp/posts/toggle/like/${postId}`,
  toggleSavePost: (postId: number) => `${baseURL}fyp/posts/toggle/save/${postId}`,
  postByUser: (userId: number) => `${baseURL}fyp/posts/${userId}`,
  postLikedByUser: (userId: number) => `${baseURL}fyp/post/profile/likes/${userId}`,
  postSavedByUser: (userId: number) => `${baseURL}fyp/post/profile/saved/${userId}`,
  postCommentStore: (postId: number) => `${baseURL}comments/store/${postId}`,
  getUserProfileData: (userId: number) => `${baseURL}user/get/profile/data/${userId}`,
  toggleFollowUser: (userId: number) => `${baseURL}fyp/user/follow/${userId}`,
};
