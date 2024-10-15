import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BLOG_API_ENDPOINT_PROD } from "../utils/env";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "../components/Headers";
import { format } from "date-fns";
import { toast } from "react-custom-alert";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

const ViewBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const token = localStorage.getItem("jwt-token");
  const navigate = useNavigate();

  const fetchPost = async (): Promise<BlogPost> => {
    const response = await axios.get(`${BLOG_API_ENDPOINT_PROD}/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.blog;
  };

  const { data: post, isLoading, isError, error } = useQuery<BlogPost, Error>({
    queryKey: ['post', id],
    queryFn: fetchPost,
  });

  useEffect(() => {
    if (post) {
      setTitleValue(post.title);
      setContentValue(post.content);
    }
  }, [post]);

  const updateMutation = useMutation({
    mutationFn: async (updatedPost: Partial<BlogPost>) => {
      await axios.put(
        `${BLOG_API_ENDPOINT_PROD}/updatepost`,
        updatedPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success('Updated successfully');
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `${BLOG_API_ENDPOINT_PROD}/deletepost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success('Deleted successfully');
      navigate('/blog');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const editHandler = () => {
    setIsOpen(true);
  };

  const deleteHandler = () => {
    deleteMutation.mutate();
  };

  const submitHandler = () => {
    updateMutation.mutate({ id, title: titleValue, content: contentValue });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error?.message || "An error occurred while fetching the post."}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Not Found</p>
          <p>The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:max-w-3xl sm:px-6 lg:px-8">
        <article className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className='flex justify-between items-center mb-4'>
            {isOpen ? (
              <input 
                value={titleValue} 
                onChange={(e) => setTitleValue(e.target.value)} 
                className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500'
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {post.title}
              </h1>
            )}
            <div className='flex space-x-2'>
              {isOpen ? (
                <button 
                  onClick={submitHandler} 
                  className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button onClick={editHandler} className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'>
                  Edit
                </button>
              )}
              <button 
                onClick={deleteHandler} 
                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200'
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            <span className="mx-2">•</span>
            <span>
              {post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)}
            </span>
          </div>
          {!isOpen ? (
            <div className="prose dark:prose-invert max-w-none">
              {post.content
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          ) : (
            <textarea 
              value={contentValue} 
              onChange={(e) => setContentValue(e.target.value)}
              className='w-full h-40 p-2 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          )}
        </article>
        <div className="mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blogs
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ViewBlog;