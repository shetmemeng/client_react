// Import necessary React and third-party libraries and components.
import React, { useState } from 'react';
import { Button, notification, Input, Modal } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../services/mutation/post';
import { IPost } from '../interfaces/post.interface';
import { EditOutlined } from '@ant-design/icons';

// Define the Props interface for the EditPost component.
interface Props {
    data: IPost; // Represents the post data to be edited, including title, description, and ID.
}

// EditPost component allows the user to edit an existing post.
const EditPost: React.FC<Props> = ({data}) => {
  // State variables to manage the post title, description, and modal visibility.
  const [title, setTitle] = useState<string>(data?.title || ''); // Initialize with the post's current title.
  const [content, setContent] = useState<string>(data?.description ||''); // Initialize with the post's current description.
  const [visible, setVisible] = useState<boolean>(false); // Modal visibility state.

  // Get the QueryClient instance for managing cached data and triggering refetches.
  const queryClient = useQueryClient();

  // Handle changes in the post description.
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Configure the mutation for updating a post using react-query's useMutation hook.
  const { mutate, isPending} = useMutation({
    mutationFn: async (payload: { title: string; description: string; id: number }) => {
      return await updatePost(payload);
    },
    onSuccess: () => {
      // Close the modal, refetch the posts, and show a success notification.
      setVisible(false);
      queryClient.refetchQueries({ queryKey: ['posts'], exact: true });
      notification.success({
        message: 'Success',
        description: 'Post has been updated successfully',
      })
    },
    onError: () => {
      // Show an error notification if the post update fails.
        notification.error({
            message: 'Post warning',
            description: 'Something went wrong',
        })
    },
  });

  // Handle the submission of the updated post.
  const handlePostSubmit = async () => {
    // Ensure both title and content are non-empty before submitting.
    if (title.trim() || content.trim()) {
      mutate({
        title,
        description: content,
        id: Number(data?.id), // Use the post ID from the provided data.
      });
    }
  };

  return (
    <>
      {/* Button to open the modal for editing the post, styled as an edit icon. */}
        <Button
            icon={<EditOutlined />}
            className="border-none bg-white shadow-none"
            onClick={() => setVisible(true)}
        />
        {/* Modal for editing a post, includes input fields for title and description. */}
      <Modal
          title="Edit Post"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          destroyOnClose
          maskClosable={false}
        >

        <div className="w-full p-5">
          <div className="w-full flex flex-col gap-5">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Text area for the post description. */}
            <Input.TextArea
              value={content}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

              {/* Submit button for saving the edited post. */}
            <div className="mt-3 flex justify-end">
              <Button
                type="primary"
                onClick={handlePostSubmit}
                disabled={!content.trim() || !title.trim()|| isPending}
                loading={isPending}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
    </Modal>
    </>
  );
};

export default EditPost; // Export the EditPost component for use in other parts of the application.
