import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle"; // Import the DarkModeToggle component
import { USER_API_ENDPOINT_LOCAL } from "../utils/env";
import { LoginHandler } from "../utils/loginFunc";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(true);

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

  const token = localStorage.getItem("jwt-token") ?? "";

  // demo login handler
  const handleDemoClick = async () => {
    const email = "random1@gmail.com";
    const password = "random123";
    await LoginHandler({ email, password, token, navigate, alertSuccess, alertError});
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
                Create a new account
              </h1>
              <p className="max-w-md text-gray-500 md:text-xl dark:text-gray-300">
                {" "}
                {/* Added dark mode class */}
                Enter your details to create a new account.
              </p>
            </div>
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
              {" "}
              {/* Added dark mode class */}
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {" "}
                    {/* Added dark mode class */}
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
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" // Added dark mode class
                  />
                </div>
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
                    placeholder="m@example.com"
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Create a password"
                    required
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" // Added dark mode class
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
            <div className="mt-4 w-[80%] text-center text-sm text-gray-900 dark:text-gray-100">
              {" "}
              {/* Added dark mode class */}
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Sign in
              </Link>
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
          
        </div>
      </section>
    </main>
  );
}
