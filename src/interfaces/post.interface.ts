import { IUser } from "./user.interface";

export interface IPost {
    id: number;
    title: string;           
    description: string;     
    createdAt: Date;       
    updatedAt: Date;  
    createdBy:  IUser;
    createdById: string;
    postImages: IPostImages[]
    comment:    IComment[]
    postReaction: IPostReaction[]
    likeCount: number;
    loveCount: number;
    postType: "EVENT" | "JOB" | "NEWS";
    eventRegistration: IEventRegistration[];
}

export interface IPostImages {
    id: number;
    image: string;
    postId: number;
}

export interface IComment {
    id: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    user: IUser;
    userId: string;
    post: IPost;
    postId: number;
    commentReaction: ICommentReaction[];
    likeCount: number;
    loveCount: number;
}

export interface IPostReaction {
    id: number;
    type: string;
    user: IUser;
    post: IPost;
    userId: string;
    postId: number;
}

export interface ICommentReaction {
    id: number;
    type: string;
    user: IUser;
    comment: IComment;
    userId: string;
    commentId: number;
}

export interface ICreateComment {
    postId: number;
    userId: string;
    comment: string;
}

export interface ICreatePost {
    title: string; 
    description: string; 
    createdById: string;
    postType: string;
}

export interface IEventRegistration {
    id: number;
    eventId: number;
    event: IPost;
    userId: string;
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
}