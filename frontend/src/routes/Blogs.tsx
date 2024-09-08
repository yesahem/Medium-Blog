import { Link } from "react-router-dom";
import { BlogSchema } from "@shishuranjan/backend-common/dist/validations";
import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import axios from "axios";

interface posts {
  id: String;
  title: String;
  content: String;
  published: Boolean;
  authorId: String;
}
const token = localStorage.getItem("jwt-token")
console.log(token);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8787/api/v1/blog/bulk`, {
        headers: {
          //    "Content-Type": "application/json",
          Authorization:
            `Bearer ${token}`
        },
      })
      .then((res) => {
        console.log(res.data);

        setPosts(res.data.posts);
        const description = res.data.posts.map((post) => {
          setDescription(post.title.substring(0, 5));
        });
        console.log("description is", description);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 flex flex-col items-center py-8">
        <section className="w-full max-w-5xl">
          {/* User Info Section */}
          <div className="flex justify-between items-center mb-8 p-6 rounded-lg ">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Shishu!</h1>
              <p className="text-gray-600">Here are your blog posts:</p>
            </div>
            <div>
              <Link
                to="/upload_Blog"
                className="inline-block px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Create New Post
              </Link>
            </div>
          </div>

          {/* Posts List */}
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.length > 0 ? (
              posts.map((post: posts) => (
                <div
                  key={post.id}
                  className="bg-white p-6 shadow rounded-lg border flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.description}</p>
                    // <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                  </div>
                  <a
                    href={`http://localhost:8787/api/v1/blog/get/${post.id}`}
                    className="inline-block text-blue-500 hover:underline"
                  >
                    Read More
                  </a>
                </div>
              ))
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
  );
}
