import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { IUser } from '../../interfaces/user.interface';

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await axiosInstance.get('/api/users');
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const getProfile = async (id: string): Promise<IUser> => {
  try {
    const response = await axiosInstance.get('/api/users/'+id);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
       message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const getUnapprovedUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/users/pending/list');
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}