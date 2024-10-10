import { Hono } from "hono";
import { Bindings, Variables } from "../types/env.types";
import {
  createBlogHandler,
  updateBlogHandler,
  getAllBlogsHandler,
  getBlogByIdHandler,
  deleteBlogHandler,
} from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogRouter.use(authMiddleware);

blogRouter.get("/bulk", ...getAllBlogsHandler);
blogRouter.get("/get/:id", ...getBlogByIdHandler);
blogRouter.post("/createpost", ...createBlogHandler);
blogRouter.put("/updatepost", ...updateBlogHandler);
blogRouter.delete("/deletepost/:id", ...deleteBlogHandler);
