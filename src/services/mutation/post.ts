import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { ICreatePost } from '../../interfaces/post.interface';

export const createPost = async (data: ICreatePost) => {
  try {
    const response = await axiosInstance.post('/api/posts/create', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const updatePost = async (data: {title: string, description: string}) => {
  try {
    const response = await axiosInstance.post('/api/posts/update', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const deletePost = async (id: number) => {
  try {
    const response = await axiosInstance.post('/api/posts/delete', {id});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const joinEvent = async (id: number, userId: string) => {
  try {
    const response = await axiosInstance.post('/api/posts/join-event', {id, userId});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
