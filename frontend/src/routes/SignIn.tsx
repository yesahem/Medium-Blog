import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle";
import { USER_API_ENDPOINT_LOCAL } from "../utils/env";
import { SignInFormData, signInSchema } from "../utils";

const alertSuccess = () => toast.success("Login Success");
const alertError = (str: string) => toast.error(str);


export default function SignIn() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) =>
      axios.post(`${USER_API_ENDPOINT_LOCAL}/signin`, data, {
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
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                Sign in to your account
              </h1>
              <p className="max-w-md text-gray-500 dark:text-gray-400 md:text-xl">
                Enter your email and password to access your account.
              </p>
            </div>
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="yourmail@example.com"
                    {...register("email")}
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your password"
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={signInMutation.isPending}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300"
                  >
                    {signInMutation.isPending ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-4 pl-[120px] text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline text-blue-500 hover:text-blue-600">
                Sign up
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
                  {" "}
                  ― Oscar Wilde{" "}
                </h5>
              </i>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}