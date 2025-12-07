export interface HashtagResponse {
  success: boolean
  data: Hashtag[]
}

export interface Hashtag {
  id: number
  name: string
  created_at: string
  updated_at: string
}
