import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();

  if (isRouteErrorResponse(err)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4">Oops, something went wrong!</h1>
        <h2 className="text-2xl mb-8">
          {err.status} : The page you are looking for doesn&apos;t exist
        </h2>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back to homepage
        </a>
      </div>
    );
  }

  return null;
};

export default Error;