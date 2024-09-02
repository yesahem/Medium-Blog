import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Index } from "./routes/Index.tsx";
import { Blogs } from "./routes/Blogs.tsx";
import { Signup } from "./routes/Signup.tsx";
import { Signin } from "./routes/SignIn.tsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "signin",
        element: <Signin />
      },
    ],
  },
]);
function App() {
  return (
    <div className="bg-zinc-800 text-white w-full ">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
