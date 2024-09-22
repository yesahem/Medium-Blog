import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./routes/Signup";
import SignIn from "./routes/SignIn";
import Blog from "./routes/Blogs";
import Index from "./routes/Index";
import Home from "./routes/Home";
import Test from "./routes/Test";
import Fetch from "./components/Fetch";
// import { lazy, Suspense } from "react";
import UploadBlogs from "./routes/UploadBlogs";
// import Test2 from "./routes/Test2";

//const Test = lazy(() => import("./routes/Test"));
// const SignUp = lazy(() => import("./routes/Signup"));
// const SignIn = lazy(() => import("./routes/SignIn"));
// const Blog = lazy(() => import("./routes/Blogs"));
// const Home = lazy(() => import("./routes/Home"));
// const Index = lazy(() => import("./routes/Index"));
// const UploadBlogs = lazy(() => import("./routes/UploadBlogs"));

// const Fetch = lazy(() => import("./components/Fetch"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      // <Suspense fallback={"Loading..."}>
      <Index />
      //</Suspense>
    ),
    children: [
      /* {
        path: "",
        element: (
          //  <Suspense fallback={"loading..."}>

          <Home />
          //</Suspense>
        ),
      },*/
      {
        path: "home" || "",
        element: (
          // <Suspense fallback={"loading..."}>
          <Home />
          // </Suspense>
        ),
      },
      {
        path: "blog",
        element: (
          //<Suspense fallback={"loading..."}>
          <Blog />
          //</Suspense>
        ),
        children: [
          {
            path: ":id",
            element: (
              //  <Suspense fallback={"loading...."}>
              <Fetch />
              // </Suspense>
            ),
          },
        ],
      },
      {
        path: "signin",
        element: (
          //<Suspense fallback={"loading..."}>
          <SignIn />
          //</Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          //<Suspense fallback={"loading..."}>
          <Signup />
          //</Suspense>
        ),
      },

      //  This route is to be removed after testing all routes
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "upload_blogs",
        element: (
          //<Suspense fallback={"Loading...."}>
          <UploadBlogs />
          //</Suspense>
        ),
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={routes} />;
}

export default App;
