export interface IUser {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    contact: string;
    job: string;
    address: string;
    batch: number;
    role: "ADMIN" | "USER";
    image: string;
    isApproved: boolean;
    employmentStatus: string;
}

export interface IUserRegister {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    contact: string;
    job: string;
    address: string;
    batch: number;
    role: "ADMIN" | "USER";
}