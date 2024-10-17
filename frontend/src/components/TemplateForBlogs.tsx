import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, ArrowLeft } from 'lucide-react';
import Header from "../components/Headers";
import { BLOG_API_ENDPOINT_PROD } from "../utils/env";
import { toast } from "react-custom-alert";

export default function BlogPostTemplate(){
interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}


// const BlogPostTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const token = localStorage.getItem("jwt-token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BLOG_API_ENDPOINT_PROD}/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data.blog);
        setEditedTitle(response.data.blog.title);
        setEditedContent(response.data.blog.content);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the blog post. Please try again later.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${BLOG_API_ENDPOINT_PROD}/updatepost`,
        {
          id: id,
          title: editedTitle,
          content: editedContent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost({ ...post!, title: editedTitle, content: editedContent });
      setIsEditing(false);
      toast.success('Updated successfully');
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(
          `${BLOG_API_ENDPOINT_PROD}/deletepost/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Deleted successfully');
        navigate('/blog');
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Not Found</p>
          <p>The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 lg:max-w-3xl sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl sm:text-4xl font-bold mb-4 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded"
            />
          ) : (
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>
          )}
          <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            <span className="mx-2">•</span>
            <span>
              {post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)}
            </span>
          </div>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded min-h-48 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {post.content.split("\n\n").map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <div className="mt-8 space-x-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
// };

}
// export default BlogPostTemplate;