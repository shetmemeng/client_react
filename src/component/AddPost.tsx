// Import necessary React and third-party libraries and components.
import React, { useState } from 'react';
import { Button, notification, Input, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { createPost } from '../services/mutation/post';
import { useAuth } from '../provider/AuthProvider';
import { ICreatePost } from '../interfaces/post.interface';

// Define the Props interface for the AddPost component.
interface Props {
  postType: "EVENT" | "JOB" | "NEWS";
  refetchPost: () => void;
}

// AddPost component handles the creation of a new post.
const AddPost: React.FC<Props> = ({postType, refetchPost}) => {
  const {
    session: { user },
  } = useAuth();

  // State variables to manage the post title, content, and modal visibility.
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  // Configure the mutation for creating a post using react-query's useMutation hook.
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ICreatePost) => {
      return await createPost(payload);
    },
    onSuccess: () => {
      // Reset state and provide feedback upon successful post creation.
      setTitle('');
      setContent('');
      setVisible(false);
      refetchPost(); // Refetch posts to display the newly created one.
      notification.success({
        message: 'Post Created',
        description: 'Your post has been created successfully!',
      });
    },
    onError: () => {
      // Show an error notification if post creation fails.
      notification.error({
        message: 'Error',
        description: 'Unable to create the post. Please try again.',
      });
    },
  });

  // Handle the submission of a new post.
  const handlePostSubmit = () => {
    // Ensure both title and content are provided before submitting
    if (title.trim() && content.trim()) {
      mutate({ title, description: content, createdById: String(user?.id), postType });
    }
  };

  return (
    <>
    {/* Button to open the modal for creating a new post. */}
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Add {postType.toLocaleLowerCase()}
      </Button>

      {/* Modal for creating a post, includes input fields for title and content. */}
      <Modal
        title={"Create "+ postType}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="rounded-lg"
      >
        <div className="p-5 space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"Enter "+ postType.toLocaleLowerCase() + " title"}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Enter " + postType.toLocaleLowerCase() + " description"}
            rows={4}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handlePostSubmit}
              disabled={!content.trim() || !title.trim() || isPending}
              loading={isPending}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Post
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddPost; // Export the AddPost component for use in other parts of the application.
