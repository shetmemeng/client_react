import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { ICreateComment } from '../../interfaces/post.interface';

export const createComment = async (data: ICreateComment) => {
  try {
    const response = await axiosInstance.post('/api/comments/create', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
