import { client } from '@/utils/http'
import type { Comment } from '@/types'

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await client.get<Comment[]>(`/comments?postId=${postId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw error
  }
}

export const createComment = async (commentData: {
  postId: number
  name: string
  email: string
  body: string
}): Promise<Comment> => {
  try {
    const response = await client.post<Comment>('/comments', commentData)
    return response.data
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

export const updateComment = async (commentId: number, data: Partial<Comment>): Promise<Comment> => {
  try {
    const response = await client.patch<Comment>(`/comments/${commentId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating comment:', error)
    throw error
  }
}

export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await client.delete(`/comments/${commentId}`)
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}
