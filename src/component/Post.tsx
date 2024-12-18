import React, { useState } from 'react';
import { Input, Button, Space, Tooltip, Avatar, notification, Divider, Modal } from 'antd';
import { LikeOutlined, HeartOutlined, CommentOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { IComment, ICreateComment, IEventRegistration, IPost } from '../interfaces/post.interface';
import { BASE_URL } from '../utils/axios-config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../services/mutation/comment';
import { useAuth } from '../provider/AuthProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createCommentReaction, createPostReaction } from '../services/mutation/reaction';
import { ICreateCommentReaction, ICreatePostReaction } from '../interfaces/reaction.interface';
import EditPost from './EditPost';
import { deletePost, joinEvent } from '../services/mutation/post';

interface Props {
  data: IPost;
  refetch: () => void;
}

dayjs.extend(relativeTime);

const Post: React.FC<Props> = ({ data, refetch }) => {
  const {
    session: { user },
  } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending: isPendingAddComment } = useMutation({
    mutationFn: async (payload: ICreateComment) => {
      return await createComment(payload);
    },
    onSuccess: () => {
      refetch();
      notification.success({
        message: 'Success',
        description: 'Comment has been saved!',
      });
      setComment('');
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Something went wrong!',
      });
    },
  });

  const { mutate: registerThisEvent, isPending: isPendingEvent } = useMutation({
    mutationFn: async ({id, userId}: {id: number, userId: string}) => {
      return await joinEvent(id, userId);
    },
    onSuccess: () => {
      refetch();
      notification.success({
        message: 'Success',
        description: 'You have successfully registered for the event!',
      });
      setComment('');
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Something went wrong!',
      });
    },
  });

  const { mutate: addReaction, isPending: isPendingReaction } = useMutation({
    mutationFn: async (payload: ICreatePostReaction) => {
      return await createPostReaction(payload);
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Something went wrong!',
      });
    },
  });


  const { mutate: addCommentReaction, isPending: isPendingCommentReaction } = useMutation({
    mutationFn: async (payload: ICreateCommentReaction) => {
      return await createCommentReaction(payload);
    },
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Something went wrong!',
      });
    },
  });

  const handleReaction = (type: 'LIKE' | 'LOVE') => {
    addReaction({ postId: data?.id as number, userId: user?.id as string, type });
  };

  const handleCommentReaction = (commentId: number, type: 'LIKE' | 'LOVE') => {
    addCommentReaction({ commentId: commentId, userId: user?.id as string, type });
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      addComment({ postId: data?.id as number, userId: user?.id as string, comment: comment.trim() });
    }
  };

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (id: number) => {
      return await deletePost(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['posts'], exact: true });
      notification.success({
        message: 'Post Deleted',
        description: 'The post has been deleted successfully.',
      });
    },
    onError: () => {
      notification.error({
        message: 'Post warning',
        description: 'Something went wrong',
      });
    },
  });

  const handleDeletePost = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        deleteMutation(id);
      },
    });
  };

  const handleRegisterThisEvent = (eventId: number) => {
    registerThisEvent({id: eventId , userId: user?.id as string});
  }

  const isUserRegisteredForEvent = (userId: string, registrations: IEventRegistration[]): boolean => {
    const registration = registrations.find(
      (reg) => reg.userId === userId
    );
    return registration !== undefined;
  };

  const isRegistered = isUserRegisteredForEvent(String(user?.id), data?.eventRegistration);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-5 mb-5">
      {/* Post Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar size="large" src={BASE_URL + '/uploads/' + data?.createdBy?.image} />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{data?.createdBy?.lastname}</h4>
            <p className="text-gray-500 text-sm">{dayjs(data.createdAt).fromNow()}</p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="flex space-x-3">
            <Tooltip title="Edit Post">
              <EditPost data={data} />
            </Tooltip>
            <Tooltip title="Delete Post">
              <Button
                icon={<DeleteOutlined />}
                className="border-none bg-white shadow-none text-red-500 hover:text-red-600"
                onClick={() => handleDeletePost(data?.id as number)}
              />
            </Tooltip>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-900">{data?.title}</p>
        <p className="text-md text-gray-700 whitespace-pre-wrap">{data?.description}</p>
      </div>

      {/* Reactions Section */}
      <Divider className="my-2" />
      <div className="flex items-center justify-between">
        <Space size="large" className="flex items-center justify-start">
        <Tooltip
            title={
              data?.postReaction?.filter((reaction) => reaction.type === 'LIKE').length > 0 ? (
                data?.postReaction
                  ?.filter((reaction) => reaction.type === 'LIKE')
                  .map((user) => (
                    <div key={user.id}>
                      <p className="text-[10px]">{user.user?.firstname} {user.user?.lastname}</p>
                    </div>
                  ))
              ) : (
                "Like"
              )
            }
          >
            <Button
              icon={<LikeOutlined className="text-blue-500 hover:scale-125 transition-transform" />}
              className="border-none bg-white shadow-none text-gray-700 hover:text-blue-500"
              onClick={() => handleReaction('LIKE')}
              disabled={isPendingReaction}
            >
              {data?.likeCount}
            </Button>
          </Tooltip>
          <Tooltip
            title={
              data?.postReaction?.filter((reaction) => reaction.type === 'LOVE').length > 0 ? (
                data?.postReaction
                  ?.filter((reaction) => reaction.type === 'LOVE')
                  .map((user) => (
                    <div key={user.id}>
                      <p className="text-[10px]">{user.user?.firstname} {user.user?.lastname}</p>
                    </div>
                  ))
              ) : (
                "Love"
              )
            }
          >
            <Button
              icon={<HeartOutlined className="text-red-500 hover:scale-125 transition-transform" />}
              className="border-none bg-white shadow-none text-gray-700 hover:text-red-500"
              onClick={() => handleReaction('LOVE')}
              disabled={isPendingReaction}
            >
              {data?.loveCount}
            </Button>
          </Tooltip>
        </Space>
        {data?.postType === 'EVENT' && (
        <div className="flex space-x-2 items-center">
        {user?.role === "USER" && isRegistered ? (
          
            <Tooltip title="You already registered this event">
              <Button
                icon={<TeamOutlined className="text-gray-500 hover:scale-125 transition-transform" />}
                className="border-none bg-white shadow-none text-gray-700 hover:text-green-500"
              >
              </Button>
            </Tooltip>
        ): user?.role !== "ADMIN" && (<div>
            <Tooltip title="Click to register this event">
              <Button
                icon={<TeamOutlined className="text-blue-500 hover:scale-125 transition-transform" />}
                className="border-none bg-white shadow-none text-gray-700 hover:text-green-500"
                onClick={() => handleRegisterThisEvent(data?.id as number)}
                disabled={isPendingEvent}
              >
              </Button>
            </Tooltip>
          </div>)}
            <Tooltip
                title={
                  <div className="flex flex-col">
                    <p className="text-[12px]">Registered users</p>
                    {data?.eventRegistration?.map((reg) => (
                      <div className="" key={reg.id}>
                        <p className="text-[10px]">
                          {reg?.user?.firstname} {reg?.user?.lastname}
                        </p>
                      </div>
                    ))}
                  </div>
                }
              >
                <span className="text-gray-500 text-[14px] cursor-pointer">
                  {data?.eventRegistration?.length || 0}
                </span>
              </Tooltip>
          </div>
          )}
      </div>

      {/* Comments Section */}
      <div className="mt-5 space-y-4">
        <Input
          placeholder="Write a comment..."
          size="large"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="rounded-md"
        />
        <Button
          type="primary"
          className="mt-2 w-full"
          disabled={isPendingAddComment}
          loading={isPendingAddComment}
          onClick={handleAddComment}
        >
          Post Comment
        </Button>
        <Tooltip title="Comments">
          <Button
            icon={<CommentOutlined />}
            className="border-none bg-white shadow-none text-gray-700"
            size="large"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? 'Hide comments' : 'Show all comments'} ({data?.comment.length})
          </Button>
        </Tooltip>

        {showComments && data?.comment.length > 0 && (
          <div className="space-y-3 mt-4">
            {data.comment.map((comment: IComment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar
                  size="small"
                  src={BASE_URL + '/uploads/' + comment?.user?.image}
                  className="bg-gray-200"
                >
                  {comment?.user?.firstname?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {`${comment?.user?.firstname ?? ''} ${comment?.user?.lastname ?? ''}`}
                  </p>
                  <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
                    <p className="text-sm text-gray-700">{comment?.comment}</p>
                  </div>
                    <Space size="large" className="flex items-center justify-end">
                      <Tooltip
                        title={
                          comment?.commentReaction?.filter((reaction) => reaction.type === 'LIKE').length > 0 ? (
                            comment?.commentReaction
                              ?.filter((reaction) => reaction.type === 'LIKE')
                              .map((user) => (
                                <div key={user.id}>
                                  <p className="text-[10px]">{user.user?.firstname} {user.user?.lastname}</p>
                                </div>
                              ))
                          ) : (
                            "Like"
                          )
                        }
                      >
                        <Button
                          icon={<LikeOutlined className="text-blue-500 hover:scale-125 transition-transform" />}
                          className="border-none bg-white shadow-none text-gray-700 hover:text-blue-500"
                          onClick={() => handleCommentReaction(comment.id,'LIKE')}
                          disabled={isPendingCommentReaction}
                        >
                          {comment?.likeCount}
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={
                          comment?.commentReaction?.filter((reaction) => reaction.type === 'LOVE').length > 0 ? (
                            comment?.commentReaction
                              ?.filter((reaction) => reaction.type === 'LOVE')
                              .map((user) => (
                                <div key={user.id}>
                                  <p className="text-[10px]">{user.user?.firstname} {user.user?.lastname}</p>
                                </div>
                              ))
                          ) : (
                            "Love"
                          )
                        }
                      >
                        <Button
                          icon={<HeartOutlined className="text-red-500 hover:scale-125 transition-transform" />}
                          className="border-none bg-white shadow-none text-gray-700 hover:text-red-500"
                          onClick={() => handleCommentReaction(comment.id,'LOVE')}
                          disabled={isPendingCommentReaction}
                        >
                          {comment?.loveCount}
                        </Button>
                      </Tooltip>
                    </Space>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
