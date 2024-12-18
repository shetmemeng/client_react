import { IUser } from "./user.interface";

export interface ISessionData {
  token: string | null;
  user: IUser | null;
  status?: string;
}

export interface ICredentials {
  username: string;
  password: string;
}