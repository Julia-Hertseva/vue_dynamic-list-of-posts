import { client } from '@/utils/http'
import type { User } from '@/types'

export const getUsers = async (): Promise<User[]> => {
  const response = await client.get<User[]>('/users')
  return response.data
}

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const response = await client.get<User[]>(`/users?email=${email}`)
    return response.data[0]
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const createUser = async (userData: {
  name: string
  email: string
  username: string
  phone?: string
  website?: string
}): Promise<User> => {
  try {
    const response = await client.post<User>('/users', userData)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
