export interface PostRequest {
  success: boolean
  data: Post[]
}

export interface Post {
  id: number
  title: string
  description: string
  photos: string[]
  post_by: PostBy
  comments: Comment[]
  likes: Like[]
  hashtags: string[]
}

export interface PostBy {
  id: number
  name: string
  avatar_url: any
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

export interface User2 {
  id: number
  name: string
  avatar_url: any
}
