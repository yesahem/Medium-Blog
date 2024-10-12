import { Link } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Headers";
import { toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import {  BLOG_API_ENDPOINT_PROD, USER_API_ENDPOINT_PROD } from "../utils/env";
// import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component

interface posts {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

const token = localStorage.getItem("jwt-token");
console.log(`this is your token ${token}`);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [description2, setDescription] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("jwt-token") || undefined || null
  );

  // Function to fetch user's Name information based on JWT token
  const fetchUserInfo = async (token: string | null) => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT_PROD}/getUserInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response", response);
      console.log("Setting name", response.data.user.name);
      setUserName(response.data.user.name);
    } catch (error) {
      toast.error("Error fetching user info");
    }
  };

  useEffect(() => {
    fetchUserInfo(token);
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("jwt-token");
      if (newToken !== token) {
        setToken(newToken);
        fetchUserInfo(newToken); // Fetch new user info when token changes
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  useEffect(() => {
    axios
      .get(`${BLOG_API_ENDPOINT_PROD}/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("print response ", res);
        console.log(`Posts length:`, res.data.posts.length);
        if (res.data.posts.length === 0 || res.data.posts) {
          setShowMessage(true);
          setPosts([]);
        }
        setPosts(res.data.posts);
        const description = res.data.posts.map((post: { title: string }) => {
          setDescription(post.title.substring(0, 5));
        });
        console.log("description is", description);
        console.log("description2 is", description2);
      })
      .catch((err) => {
        console.log("Error in get axios");
        console.log(err);
      });
  }, [description2, token]);

  const truncateContent = (content: string, length: number) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + "...";
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        {" "}
        {/* Added dark mode class */}
        <main className="flex-1 flex flex-col items-center py-8">
          <section className="w-full max-w-5xl">
            {/* User Info Section */}
            <div className="flex justify-between items-center mb-8 p-6 rounded-lg">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome Back {userName.charAt(0).toUpperCase() + userName.slice(1)}
                </h1>
                {/* Added dark mode class */}
                <p className="text-gray-600 dark:text-gray-300">
                  Here are your blog posts:
                </p>
                {/* Added dark mode class */}
              </div>
              <div>
                <Link
                  to="/upload-blogs"
                  className="inline-block px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Create New Post
                </Link>
              </div>
            </div>

            {/* Posts List */}
            <div className="grid gap-6 lg:grid-cols-2">
              {posts.length > 0 ? (
                posts.map((post: posts, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border flex flex-col justify-between"
                  >
                    {" "}
                    {/* Added dark mode class */}
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {post.title}
                      </h2>
                      {/* Added dark mode class */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {truncateContent(post.content, 100)}
                      </p>
                      {/* Added dark mode class */}
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
                <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border flex justify-between">
                  {/* Added dark mode class */}
                  Start uploading Blog to get started 🎉{" "}
                </div>
              ) : (
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
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
