import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  BlogSchema,
  UpdateBlogSchema,
} from "@shishuranjan/backend-common/dist/validations";
import { Bindings, Variables } from "../types/env.types";
import { createFactory } from "hono/factory";
import { log } from "console";
import { demoEmail } from "../utils/demoEmail";

export const blogsRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

const factory = createFactory();

// Create Blog Handler
export const createBlogHandler = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const body: BlogSchema = await c.req.json();

  // demo account restriction
  const incomingEmail = user?.email;
  if (incomingEmail === demoEmail) {
    return c.json({ message: "Not Allowed on Guest Account!" }, { status: 403 });
  }

  if (!body) {
    c.status(411);
    return c.json({ message: "Invalid Inputs" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogPost = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
      authorId: user.id,
    },
  });

  return c.json({ message: "Blog created successfully", blogPost });
});

// Update Blog Handler
export const updateBlogHandler = factory.createHandlers(async (c) => {
  const userid = c.var.userid; // Get the user ID from the context
  const updatedBody: UpdateBlogSchema = await c.req.json();

  // demo account restriction
  const user = c.get("user");
  const incomingEmail = user?.email;
  if (incomingEmail === demoEmail) {
    return c.json({ message: "Not Allowed on Guest Account!" }, { status: 403 });
  }

  if (!updatedBody || (!updatedBody.title && !updatedBody.content)) {
    c.status(411);
    return c.json({ message: "Invalid Inputs" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Fetch the existing blog post based on ID and authorId
  const existingBlog = await prisma.post.findUnique({
    where: {
      id: updatedBody.id,
      authorId: userid, // Ensure the blog belongs to the user
    },
  });

  // Check if the blog post exists
  if (!existingBlog) {
    c.status(404);
    return c.json({ message: "Blog not found or not authorized" });
  }

  const updateData: Partial<UpdateBlogSchema> = {};
  if (updatedBody.title) {
    updateData.title = updatedBody.title;
  }
  if (updatedBody.content) {
    updateData.content = updatedBody.content;
  }

  // Update the blog post
  const updatedBlog = await prisma.post.update({
    where: {
      id: existingBlog.id, // Ensure the ID is correct
    },
    data: {
      ...updateData, // Spread only the fields that need to be updated
      published: existingBlog.published, // Keep the existing published status
    },
  });

  return c.json({ message: "Blog updated successfully", updatedBlog });
});

// Get Blog by ID Handler
export const getBlogByIdHandler = factory.createHandlers(async (c) => {
  const param = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogWithId = await prisma.post.findFirst({
    where: { id: param },
    include: {
      author: {
        select: {
          name: true, // Show the author name on frontend
        },
      },
    },
  });

  if (!blogWithId) {
    c.status(404);
    return c.json({ message: "Blog not found" });
  }

  return c.json({ blog: blogWithId });
});

// Get All Blogs Handler
export const getAllBlogsHandler = factory.createHandlers(async (c) => {
  console.log("Getting all posts from backend /bulk route");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  console.log("Prisma client created");
  
  const allPosts = await prisma.post.findMany();
  return c.json({
    message: "This is a route to get all the posts",
    posts: allPosts,
  });
  
});

// Delete Blog by ID Handler
export const deleteBlogHandler = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // demo account restriction
  const user = c.get("user");
  const incomingEmail = user?.email;
  if (incomingEmail === demoEmail) {
    return c.json({ message: "Not Allowed on Guest Account!" }, { status: 403 });
  }

  const userid = c.var.userid; // Get the user ID from the context
  const { id } = c.req.param(); // Get the blog ID from the request body

  // Validate incoming body
  if (!id) {
    c.status(400);
    return c.json({ message: "Blog ID is required" });
  }

  // Check if the blog post exists and belongs to the user
  const existingBlog = await prisma.post.findUnique({
    where: {
      id: id,
      authorId: userid, // Ensure the blog belongs to the user
    },
  });

  // If the blog post does not exist or does not belong to the user
  if (!existingBlog) {
    c.status(404);
    return c.json({ message: "Blog not found or not authorized" });
  }

  // Delete the blog post
  await prisma.post.delete({
    where: {
      id: id,
    },
  });

  return c.json({ message: "Blog deleted successfully" });
});
