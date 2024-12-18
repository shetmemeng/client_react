import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { ICreateCommentReaction, ICreatePostReaction } from '../../interfaces/reaction.interface';

export const createPostReaction = async (data: ICreatePostReaction) => {
  try {
    const response = await axiosInstance.post('/api/reactions/posts', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const createCommentReaction = async (data: ICreateCommentReaction) => {
    try {
      const response = await axiosInstance.post('/api/reactions/comments', data);
      return response.data;
    } catch(error) {
      let message;
      if (error instanceof AxiosError) {
         message = error.response?.data.message;
      }
      throw new Error(message || 'Something went wrong')
    }
}
