import { client } from '@/utils/http'
import type { Post } from '@/types'

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await client.get<Post[]>('/posts') 
    return response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  try {
    const response = await client.get<Post[]>(`/posts?userId=${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user posts:', error)
    throw error
  }
}

export const createPost = async (userId: number, title: string, body: string): Promise<Post> => {
  try {
    const response = await client.post<Post>('/posts', {
      userId,
      title,
      body,
    })
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const updatePost = async (postId: number, data: Partial<Post>): Promise<Post> => {
  try {
    const response = await client.patch<Post>(`/posts/${postId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await client.delete(`/posts/${postId}`)
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
