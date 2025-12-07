export interface PostResponse{

}

export interface PostRequest {
  success: boolean
  empty: boolean
  data: Post[]
}

export interface Post {
  id: number
  title: string
  description: string
  photos: string[]
  already_saved: boolean
  already_liked: boolean
  post_by: PostBy
  comments: Comment[]
  likes: Like[]
  saves: Save[]
  hashtags: string[]
}

export interface PostBy {
  id: number
  name: string
  avatar_url: any
}

export interface CommentResponse{
    'success': boolean
    'data': Comment
}

export interface Comment {
  id: number
  content: string
  user: User
}

export interface User {
  id: number
  name: string
  avatar_url: any
}

export interface Like {
  user: User2
}
export interface Save{
    user: User2
}
export interface User2 {
  id: number
  name: string
  avatar_url: any
}

export interface ToggleResponse{
    success: boolean
    state : boolean
}