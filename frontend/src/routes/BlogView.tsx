import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BLOG_API_ENDPOINT_PROD } from "../utils/env";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "../components/Headers";
import { format } from "date-fns";
import { toast } from "react-custom-alert";
import { deleteHandler, submitHandler } from "../utils/blogHandlers";

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
  const [isOpen, setIsOpen] = useState<Boolean>(false);
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
        if (response?.data?.blog) {
          setPost(response.data.blog);
          setTitleValue(response.data.blog.title); // Directly set the values here
          setContentValue(response.data.blog.content);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the blog post. Please try again later.");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]); // Removed isOpen from dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
  };

  // DELETE HANDLER
  function deleteBlog() {
    deleteHandler(id ?? "", token ?? "", navigate);
  }

  // SUBMIT HANDLER
  function submitBlog() {
    submitHandler({
      id: id ?? "",
      token: token ?? "",
      titleValue,
      contentValue,
      setIsOpen,
    });
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 lg:max-w-3xl sm:px-6 lg:px-8">
        <article className="mb-12">
          <div className="flex ">
            {isOpen ? (
              <input
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value);
                }}
                className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-black border-black border-2 "
              ></input>
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {post.title}
              </h1>
            )}
            <div className="flex ml-10">
              {isOpen ? (
                <div className="pl-52 pt-2">
                  <button
                    onClick={submitBlog}
                    className="w-24 h-10 bg-blue-500 rounded-md  text-white"
                  >
                    submit
                  </button>
                </div>
              ) : (
                <div className="pl-52 pt-2">
                  <button
                    onClick={editHandler}
                    className="w-28 h-10 bg-blue-500 rounded-md  text-white"
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="pt-2 ml-2">
                <button
                  onClick={deleteBlog}
                  className="w-28 h-10 bg-red-500 rounded-md  text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            <span className="mx-2">•</span>
            <span>
              {post.author.name.charAt(0).toUpperCase() +
                post.author.name.slice(1)}
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
              className="w-[100%] h-40 p-[10px]"
              onChange={(e) => {
                setContentValue(e.target.value);
              }}
            ></textarea>
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
