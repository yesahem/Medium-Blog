import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Headers";

export default function Home() {
  const isLogin = localStorage.getItem('isLogin');
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"> {/* Added dark mode class */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100"> {/* Added dark mode class */}
                Welcome to Blogs Hub
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"> {/* Added dark mode class */}
                "The best time for new beginnings is now."
              </p>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"> {/* Added dark mode class */}
                "Don’t focus on having a great blog. Focus on producing a blog
                that’s great for your readers."
              </p>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"> {/* Added dark mode class */}
                "Blogging is not rocket science. It’s about being yourself and
                putting what you have into it."
              </p>
              { isLogin === 'true' ? <Link
                to="/blogs"
                className="inline-block mt-8 px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600"
              >
                Start Uploading Blogs
              </Link>:<Link
                to="/signin"
                className="inline-block mt-8 px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600"
              >
                Start Uploading Blogs
              </Link>}
            </div>
          </section>
        </main>
      </div>
      <Footer />
      </div>
  );
}
