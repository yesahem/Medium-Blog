import axios from "axios";
import { SyntheticEvent, useState, useEffect } from "react";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component

const alertSuccess = () =>
  toast.success("Signup Successful, Redirecting to Login");
const alertError = (str: string) => toast.error(str);

/*
async function hashUsersPassword(usersPassword: string) {
  const hashedPassword = await bcrypt.hash(usersPassword, 0);
  console.log(`hashedPassword is ${hashedPassword}`);

  return hashedPassword.toString();
}
*/

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  async function signupHandler(e: SyntheticEvent) {
    e.preventDefault();
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);
    //    const hashedPassword = await hashUsersPassword(password);

    axios
      .post("https://backend.ahemraj82.workers.dev/api/v1/user/signup", {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        // console.log("current");
        console.log(`Response ${res}`);
        console.log(res.data.err);

        // localStorage.setItem(`jwt-token`, res.data.token);
        // localStorage.setItem("isLogin", "false");

        if (!res.data.err) {
          alertSuccess();
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          alertError("Invalid Email or Password");
        }
      })
      .catch((err) => {
        console.log("err: ", err);
        alertError(err.response.data.message);
      });
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="flex-1 flex justify-center items-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-center tracking-tight sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                  Create a new account
                </h1>
                <div className="items-center justify-center flex">
                  <p className="max-w-lg text-gray-500 dark:text-gray-300 md:text-xl justify-center">
                    Enter your details to create a new account.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg mx-auto">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Create a password"
                      required
                      className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={signupHandler}
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-4 text-center text-sm text-gray-900 dark:text-gray-100">
                Already have an account?{" "}
                <Link to="/signin" className="underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
}