import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BLOG_API_ENDPOINT_PROD } from "../utils/env";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "../components/Headers";
import { format } from "date-fns";
import { toast } from "react-custom-alert";

interface BlogPost {
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

const ViewBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const token = localStorage.getItem("jwt-token");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${BLOG_API_ENDPOINT_PROD}/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPost(response.data.blog);
        if(response.data.blog?.title) {
          setTitleValue(response.data.blog.title);
        }
        if(response.data.blog?.content) {
          setContentValue(response.data.blog.content);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the blog post. Please try again later.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token, isOpen]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const editHandler = () => {
    setIsOpen(true);
  }

  const deleteHandler = async () => {
    await axios.delete(
      `${BLOG_API_ENDPOINT_PROD}/deletepost/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success('Deleted successfully');
    navigate('/blog')
  }

  const submitHandler = async () => {
    await axios.put(
      `${BLOG_API_ENDPOINT_PROD}/updatepost`, 
      {
        id: id,
        title: titleValue,
        content: contentValue
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('updated successfully');
    setIsOpen(false);
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
                <button onClick={submitHandler} className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'>
                  Submit
                </button>
              ) : (
                <button onClick={editHandler} className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'>
                  Edit
                </button>
              )}
              <button onClick={deleteHandler} className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200'>
                Delete
              </button>
            </div>
          </div>
          <div className="flex  items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
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