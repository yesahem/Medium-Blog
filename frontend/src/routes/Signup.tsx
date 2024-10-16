import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-custom-alert";
import { Link, useNavigate } from "react-router-dom";
import "react-custom-alert/dist/index.css";
import DarkModeToggle from "../components/DarkModeToggle";
import { USER_API_ENDPOINT_PROD } from "../utils/env";
import { SignUpFormData, signUpSchema } from "../utils";

const alertSuccess = () =>
  toast.success("Signup Successful, Redirecting to Login");
const alertError = (str: string) => toast.error(str);

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormData) =>
      axios.post(`${USER_API_ENDPOINT_PROD}/signup`, data),
    onSuccess: (res) => {
      console.log(`Response ${res}`);
      console.log(res.data.err);

      if (!res.data.err) {
        alertSuccess();
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        alertError("Invalid Email or Password");
      }
    },
    onError: (error) => {
      console.log("err: ", error);
      alertError("An error occurred during sign up");
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full lg:w-2/3 py-6"
            >
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
                  {...register("name")}
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
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
                  {...register("email")}
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
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
                  {...register("password")}
                  placeholder="Create a password"
                  required
                  className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-6">
                <button
                  disabled={signUpMutation.isPending}
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
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
    </div>
  );
}
