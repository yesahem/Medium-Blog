import { Context, Hono } from "hono";

import { decode, sign, verify, jwt } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogsRouter } from "./routes/blogs";




const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
    Variables: {
      username: string;
    }
}>();


app.route('/api/v1/blog/', blogsRouter)
app.route( "/api/v1/user/", userRouter)

export default app;
