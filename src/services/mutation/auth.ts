import { AxiosError } from 'axios'
import axiosInstance from '../../utils/axios-config';
import { ICredentials, ISessionData } from '../../interfaces/auth.interface';
import { IUserRegister } from '../../interfaces/user.interface';

export const signin = async (data: ICredentials): Promise<ISessionData> => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const register = async (data: IUserRegister) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch(error) {
      let message;
      if (error instanceof AxiosError) {
         message = error.response?.data.message;
      }
      throw new Error(message || 'Something went wrong')
    }
}

export const updateProfile = async (data: FormData) => {
  try {
    const response = await axiosInstance.post('/api/users/update', data,{
      headers: {'Content-Type': 'multipart/form-data'}
    });
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export const approved = async (id: string) => {
  try {
    const response = await axiosInstance.post('/api/users/approved', {id});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}


export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.post('/api/users/delete', {id});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
