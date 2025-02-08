import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle";
import { USER_API_ENDPOINT_PROD } from "../utils/env";
import { SignInFormData, signInSchema } from "../utils";

const alertSuccess = () => toast.success("Login Success");
const alertError = (str: string) => toast.error(str);

export default function SignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) =>
      axios.post(`${USER_API_ENDPOINT_PROD}/signin`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
      }),
    onSuccess: (res) => {
      if (res.data.token) {
        console.log("Login Response is:", res);
        alertSuccess();
        localStorage.setItem("jwt-token", res.data.token);
        localStorage.setItem("isLogin", "true");
        navigate("/blog");
      } else {
        alertError("Incorrect credentials");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      alertError("An error occurred during sign in");
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data);
  };

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
              <h1 className="text-xl font-medium sm:text-3xl text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text">
                Welcome back!
              </h1>
              <p className="text-sm opacity-55 py-2">
                Please login to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="py-6">
                <div className="w-[80%]">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100 py-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="yourmail@example.com"
                    {...register("email")}
                    className={`block w-full border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-3xl h-12 p-6  hover:scale-105 hover:shadow-lg hover:shadow-blue-200 transition duration-150 shadow-md ${errors.email?.message ? "shadow-red-200" : "shadow-blue-200"}`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 w-[80%]">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`block w-full border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-3xl h-12 p-6  hover:scale-105 hover:shadow-lg hover:shadow-blue-200 transition duration-150 shadow-md ${errors.password?.message ? "shadow-red-200" : "shadow-blue-200"}`}
                  placeholder="Your password"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="relative group top-6 w-[80%]">
                <div className="absolute w-full -inset-1 bg-gradient-to-r from-red-600 to-purple-600 p-2 rounded-3xl h-12 blur opacity-75 group-hover:opacity-100 transition duration-150 animate-tilt">
                </div>
                <button
                  disabled={signInMutation.isPending}
                  type="submit"
                  className="relative w-full bg-blue-500 text-white rounded-3xl h-12 hover:bg-blue-600 transition-colors duration-200"
                >
                  {signInMutation.isPending ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="flex justify-center items-center w-full lg:w-2/3 pt-20 text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="underline text-blue-500 hover:text-blue-600"
              >
                Sign up
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
    </main>
  );
}
