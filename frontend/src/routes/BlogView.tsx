import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BLOG_API_ENDPOINT_LOCAL } from "../utils/env";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "../components/Headers";
import { format } from "date-fns";

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
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${BLOG_API_ENDPOINT_LOCAL}/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPost(response.data.blog);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the blog post. Please try again later.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4"
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            <span className="mx-2">•</span>
            <span>
              {post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)}
            </span>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
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