import { SyntheticEvent, useState } from "react";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component
import { LoginHandler } from "../utils/loginFunc";


const alertSuccess = () => toast.success("Login Success");
const alertError = (str: string) => toast.error(str);

const token = localStorage.getItem("jwt-token") ?? "";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(true);

  const navigate = useNavigate();

  // login handler
  const handleLogin = async(e:SyntheticEvent) => {
    await LoginHandler({e, email, password, token, navigate, alertSuccess, alertError});
  };

  // demo handler
  const handleDemoClick = async (e:SyntheticEvent) => {
    const email = "random1@gmail.com";
    const password = "random123";
    await LoginHandler({e, email, password, token, navigate, alertSuccess, alertError});
    setShowDemo(false);
  };

  return (
    <main className="flex-1 bg-gray-100 dark:bg-gray-900">
      {" "}
      {/* Added dark mode class */}
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
        {" "}
        {/* Added dark mode class */}
        <div className="flex items-center">
          <DarkModeToggle /> {/* Added DarkModeToggle component */}
        </div>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                {" "}
                {/* Added dark mode class */}
                Sign in to your account
              </h1>
              <p className="max-w-md text-gray-500 md:text-xl dark:text-gray-300">
                {" "}
                {/* Added dark mode class */}
                Enter your email and password to access your account.
              </p>
            </div>
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
              {" "}
              {/* Added dark mode class */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {" "}
                    {/* Added dark mode class */}
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="yourmail@example.com"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" // Added dark mode class
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {" "}
                    {/* Added dark mode class */}
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" // Added dark mode class
                    placeholder="Your password"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleLogin}
                >
                  Sign in
                </button>
              </div>
            </div>
            <div className="mt-4 pl-[120px] text-sm text-gray-900 dark:text-gray-100">
              {" "}
              {/* Added dark mode class */}
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* demo component/box */}
          <div className={`${showDemo ? "" : "hidden"} w-[250px] h-[100px] justify-center items-center absolute bg-slate-300 top-52 md:top-8 md:right-[20%] right-[10%] p-6 z-20 rounded-md max-md:hidden`}>
            <div className="flex flex-col gap-2 relative">
              <p 
              className="absolute top-[-28px] right-[-27px] text-xl rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer"
              onClick={() => { setShowDemo(false) }}
              >
                ❌
              </p>
              <div className="gap-y-2 flex flex-col">
                <p className="text-2xl font-extrabold text-richblack-5 flex items-center -mt-1">
                  Try Demo
                </p>
                <div>
                  <button
                    onClick={handleDemoClick}
                    className="bg-gray-800 text-white font-medium font-mono mb-1 text-richblack-25 px-4 py-1 rounded-md flex"
                  >
                    🚀 Click for Demo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="mt-[15px] text-center justify-center">
              <h3 className="text-9xl font-bold sm:text-5xl xl:text-6xl text-center text-gray-900 dark:text-gray-100">
                {" "}
                {/* Added dark mode class */}
                “Be yourself; everyone else is already taken.”
                <br />
              </h3>
              <br />{" "}
              <i>
                <h5 className="text-md font-bold sm:text-5xl xl:text-6xl text-center text-gray-900 dark:text-gray-100">
                  {" "}
                  {/* Added dark mode class */} ― Oscar Wilde{" "}
                </h5>
              </i>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
