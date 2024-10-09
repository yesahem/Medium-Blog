import { Hono } from "hono";
import {
  signUpHandler,
  signInHandler,
  getUserInfoHandler,
} from "../controllers/index";
import { Bindings, Variables } from "../types/env.types";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

userRouter.post("/signin", ...signInHandler);
userRouter.post("/signup", ...signUpHandler);
userRouter.get("/getUserInfo", authMiddleware, ...getUserInfoHandler);
