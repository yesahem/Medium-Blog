import axios from "axios";
import { SyntheticEvent, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { BLOG_API_ENDPOINT_LOCAL } from "../utils/env";
import { useNavigate } from "react-router-dom";

export default function UploadBlogs() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("jwt-token");

  const blogUploadHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("I am a blog upload handler");
    console.log(`Title: ${title}`);
    console.log(`Content: ${content}`);

    try {
      const res = await axios.post(
        `${BLOG_API_ENDPOINT_LOCAL}/createpost`,
        {
          title: title,
          content: content,
          published: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response after blog upload:", res);
      // Redirect to the blog page after successful upload
      navigate("/blog"); // Adjust the path as needed
    } catch (err) {
      console.error("Error uploading blog:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </header>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-center tracking-tight sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                  Upload your Blog
                </h1>
                <div className="items-center justify-center flex">
                  <p className="max-w-lg text-gray-500 md:text-xl justify-center dark:text-gray-300">
                    Blogging is an art, Be an artist
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg mx-auto border-2 border-green-400 dark:border-green-600">
                <form className="space-y-4" onSubmit={blogUploadHandler}>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Title
                    </label>
                    <input
                      id="title"
                      autoFocus
                      placeholder="Title"
                      required
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Your Content Here
                    </label>
                    <textarea
                      id="content"
                      placeholder="Content"
                      required
                      onChange={(e) => setContent(e.target.value)}
                      className="block w-full p-2 border rounded min-h-48 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}