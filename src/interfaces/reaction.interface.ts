export interface ICreatePostReaction {
    postId: number;
    userId: string;
    type: "LIKE" | "LOVE";
}

export interface ICreateCommentReaction {
    commentId: number;
    userId: string;
    type: "LIKE" | "LOVE";
}