import { Hono } from "hono";
import { userRouter, blogRouter } from "./routes/index";
import { cors } from "hono/cors";
import { Bindings, Variables } from "./types/env.types";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", cors());

app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

app.get("/health", (c) => {
  return c.json({
    Message: "okay",
  });
});

export default app;
