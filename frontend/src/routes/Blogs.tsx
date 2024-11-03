import { Link } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Headers";
import { toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { BLOG_API_ENDPOINT_LOCAL, USER_API_ENDPOINT_LOCAL } from "../utils/env";
import { useQuery } from "@tanstack/react-query";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

export default function Blog() {
  const [showMessage, setShowMessage] = useState(false);
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("jwt-token") || undefined || null
  );

  const fetchUserInfo = async (token: string | null) => {
    if (!token) return null;
    const response = await axios.get(
      `${USER_API_ENDPOINT_LOCAL}/getUserInfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.user;
  };

  const { data: userInfo, isError : userError } = useQuery({
    queryKey: ['userInfo', token],
    queryFn: () => fetchUserInfo(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
    }
  }, [userInfo]);

  const fetchPosts = async () => {
    const response = await axios.get(`${BLOG_API_ENDPOINT_LOCAL}/bulk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.posts;
  };

  const { data: posts, isLoading, isError : postError } = useQuery({
    queryKey: ['posts', token],
    queryFn: fetchPosts,
    enabled: !!token,
  });

  useEffect(() => {
    if (posts && posts.length === 0) {
      setShowMessage(true);
    }
  }, [posts]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("jwt-token");
      if (newToken !== token) {
        setToken(newToken);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const truncateContent = (content: string, length: number) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + "...";
  };

  if(postError || userError) {
    toast.error("Error loading posts. Please try again later.");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col">
        <main className="flex-1 flex flex-col items-center py-8">
          <section className="w-full max-w-5xl px-4 md:px-6">
            <div className="flex justify-between items-center mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome Back {userName.charAt(0).toUpperCase() + userName.slice(1)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Here are your blog posts:
                </p>
              </div>
              <div>
                <Link
                  to="/upload-blogs"
                  className="inline-block px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Create New Post
                </Link>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {isLoading ? (
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                    "#0390fc",
                  ]}
                />
              ) : postError ? (
                <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between text-gray-600 dark:text-gray-300">
                  Error loading posts. Please try again later.
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post: Post, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {truncateContent(post.content, 100)}
                      </p>
                    </div>
                    <Link
                      to={`/view-blog/${post.id}`}
                      className="inline-block text-blue-500 hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                ))
              ) : showMessage ? (
                <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between text-gray-600 dark:text-gray-300">
                  Start uploading Blog to get started 🎉
                </div>
              ) : null}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}