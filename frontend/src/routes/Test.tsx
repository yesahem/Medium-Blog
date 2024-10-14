import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Test1",
    description: "This is a overview of the first blog post.",
    date: " 30th August , 2024",
  },
  {
    id: 2,
    title: "Test 2",
    description: "This is a overview of the second blog post.",
    date: "September 1st, 2024",
  },
  {
    id: 3,
    title: "Teachers Day",
    description: "Happy Teachers Day to all teachers",
    date: "September 5th, 2024",
  },
  {
    title: "test 4",
    description: "This is a overview of the fourth blog post.",
    date: "September 10th, 2024",
    id: 4,
  },
];

export default function Test() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 flex flex-col items-center py-8">
        <section className="w-full max-w-5xl px-4">
          {/* User Info Section */}
          <div className="flex justify-between items-center mb-8 p-6 rounded-lg bg-white dark:bg-gray-800">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, Shishu!</h1>
              <p className="text-gray-600 dark:text-gray-300">Here are your latest blog posts:</p>
            </div>
            <Link
              to="/upload_blogs"
              className="inline-block px-6 py-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Create New Post
            </Link>
          </div>

          {/* Posts List */}
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{post.date}</p>
                  </div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="inline-block text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">No posts yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}