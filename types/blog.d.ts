// types/blog.d.ts
export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  image?: string
  slug?: string
  author?: string
  created_at?: string
  updated_at?: string
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  totalPages: number
  currentPage?: number
}
