import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component
import { USER_API_ENDPOINT_PROD } from "../utils/env";

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

  const navigate = useNavigate();

  async function signupHandler(e: SyntheticEvent) {
    e.preventDefault();
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);
    //    const hashedPassword = await hashUsersPassword(password);

    axios
      .post(`${USER_API_ENDPOINT_PROD}/signup`, {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        // console.log("current");
        console.log(`Response ${res}`);
        console.log(res.data.err);

        // localStorage.setItem("jwt-token", res.data.token);
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
    <main className="flex-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </header>
      <section className="w-full flex h-[calc(100vh-80px)] px-10 sm:px-20 py-8">
        <div className="w-full lg:w-1/2 h-full flex justify-center items-center flex-col lg:block relative">
          <div className="w-full text-gray-900 dark:text-gray-100">
            <div>
              <h1 className="text-xl font-medium sm:text-3xl ">
                Create a new account!
              </h1>
              <p className="text-sm opacity-55 py-2">
                {" "}
                Enter your details to create a new account
              </p>
            </div>

            <form className="space-y-4 w-full lg:w-2/3 py-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
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
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
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
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
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
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-6">
                <button
                  onClick={signupHandler}
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="flex justify-center items-center w-full lg:w-2/3 pt-10 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="underline text-blue-500 hover:text-blue-600"
              >
                Sign in
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 w-full lg:w-2/3  flex justify-center items-center">
              <div className="">
                <p className="italic">
                  "Be yourself; everyone else is already taken."
                </p>
                <p className="text-center italic text-sm">― Oscar Wilde </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden h-full lg:block w-full sm:w-1/2">
          <img src="./writer.svg" alt="writer" className="" />
        </div>
      </section>
      {/* <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                Create a new account
              </h1>
              <p className="max-w-md text-gray-500 dark:text-gray-400 md:text-xl">
                Enter your details to create a new account.
              </p>
            </div>
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
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
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
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
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
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
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={signupHandler}
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/signin" className="underline text-blue-500 hover:text-blue-600">
                Sign in
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="mt-[15px] text-center justify-center">
              <h3 className="text-9xl font-bold sm:text-5xl xl:text-6xl text-center text-gray-900 dark:text-gray-100">
                "Be yourself; everyone else is already taken."
                <br />
              </h3>
              <br />{" "}
              <i>
                <h5 className="text-md font-bold sm:text-5xl xl:text-6xl text-center text-gray-900 dark:text-gray-100">
                  ― Oscar Wilde{" "}
                </h5>
              </i>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
