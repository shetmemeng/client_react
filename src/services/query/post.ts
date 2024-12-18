import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { IPost } from '../../interfaces/post.interface';

export const getAllPosts = async (type: string): Promise<IPost[]> => {
  try {
    const response = await axiosInstance.get('/api/posts/'+type);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
