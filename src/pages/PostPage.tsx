import React from 'react';
import Post from '../component/Post';
import Navbar from '../component/Navbar';
import AddPost from '../component/AddPost';
import { useQuery } from '@tanstack/react-query';
import { getAllPosts } from '../services/query/post';
import { IPost } from '../interfaces/post.interface';
import { useAuth } from '../provider/AuthProvider';
import { Skeleton } from 'antd';

interface Props {
  postType: "EVENT" | "JOB" | "NEWS";
}

const EventPage: React.FC<Props> = ({ postType }) => {
  const {
    session: { user },
  } = useAuth();

  const { data, isLoading, refetch: refetchPost } = useQuery({
    queryKey: ['posts', postType],
    queryFn: () => getAllPosts(postType),
  });

  return (
    <div className="w-full min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        {user?.role === 'ADMIN' && (
          <div className="flex justify-between items-center mb-5 bg-white shadow-md rounded-lg p-5">
            <h2 className="text-lg font-bold">{postType} Management</h2>
            <AddPost postType={postType} refetchPost={refetchPost}/>
          </div>
        )}

        {/* Skeleton Loader for Posts */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          data && data.length > 0 ? (
            data.map((post: IPost) => (
              <Post key={post.id} data={post} refetch={refetchPost} />
            ))
          ) : (
            <div className="text-center p-5 bg-white shadow-md rounded-lg">
              <p className="text-gray-500">No {postType.toLocaleLowerCase()} available!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EventPage;
