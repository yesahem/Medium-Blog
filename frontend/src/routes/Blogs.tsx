import { Link } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Headers";
import { toast } from "react-custom-alert";
import 'react-custom-alert/dist/index.css';
import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component

interface posts {
  id: String;
  title: String;
  content: String;
  published: Boolean;
  authorId: String;
}

const token = localStorage.getItem("jwt-token");
console.log(`this is your token ${token}`);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [description2, setDescription] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(localStorage.getItem("jwt-token") || undefined || null);

  // Function to fetch user's Name information based on JWT token
  const fetchUserInfo = async (token: string | null) => {
    if (!token) return;

    try {
      const response = await axios.get("https://backend.ahemraj82.workers.dev/api/v1/user/getUserInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        fetchUserInfo(newToken);  // Fetch new user info when token changes
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
      .get("https://backend.ahemraj82.workers.dev/api/v1/blog/bulk", {
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
        const description = res.data.posts.map((post: { title: String }) => {
          setDescription(post.title.substring(0, 5));
        });
        console.log("description is", description);
        console.log("description2 is", description2);
      })
      .catch((err) => {
        console.log("Error in get axios");
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Added dark mode class */}
        <main className="flex-1 flex flex-col items-center py-8">
          <section className="w-full max-w-5xl">
            {/* User Info Section */}
            <div className="flex justify-between items-center mb-8 p-6 rounded-lg">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back {userName}</h1> {/* Added dark mode class */}
                <p className="text-gray-600 dark:text-gray-300">Here are your blog posts:</p> {/* Added dark mode class */}
              </div>
              <div>
                <Link
                  to="/upload_blogs"
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
                    className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border flex flex-col justify-between"> {/* Added dark mode class */}
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h2> {/* Added dark mode class */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p> {/* Added dark mode class */}
                    </div>
                    <a
                      href={`https://backend.ahemraj82.workers.dev/api/v1/blog/get/${post.id}`}
                      className="inline-block text-blue-500 hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                ))
              ) : showMessage ? (
                <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border flex justify-between"> {/* Added dark mode class */}
                  Start uploading Blog to get started 🎉{" "}
                </div>
              ) : (
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperClass="color-ring-wrapper"
                  colors={["#0390fc", "#0390fc", "#0390fc", "#0390fc", "#0390fc"]}
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}