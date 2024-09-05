import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex justify-center items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-center tracking-tight sm:text-5xl xl:text-6xl">
                  Create a new account
                </h1>
                <div className="items-center justify-center flex">
                  <p className="max-w-lg text-gray-500 md:text-xl justify-center">
                    Enter your details to create a new account.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-white shadow rounded-lg mx-auto">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="block w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="block w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      className="block w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
