import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { BlogSchema, UpdateBlogSchema } from "@shishuranjan/backend-common/dist/validations";
import { Bindings, Variables } from "../types/env.types";
import { createFactory } from "hono/factory";
import { log } from "console";

export const blogsRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

const factory = createFactory();

export const createBlogHandler = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const bucket = c.env.MY_BUCKET;

  const formData = await c.req.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const published = formData.get("published") === 'true';

  if (!title || !content) {
    c.status(400);
    return c.json({ message: "Invalid Inputs" });
  }

  const uploadedFileNames: string[] = [];

  // Use a for...of loop to iterate over the keys in FormData
  for (const key of formData.keys()) {
    const value = formData.get(key); // Get the value for the current key
    console.log(value);
    // Check if the key starts with "picture_"
    if (key.startsWith("picture_") && value instanceof File) {
      const file = value as File; // Type assertion to File
      const fileName = `${Date.now()}-${user.id}-${key}.jpg`; // Unique file name

      // Upload to R2 bucket
      const res = await bucket.put(fileName, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      uploadedFileNames.push(fileName); // Store uploaded file name
    }
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogPost = await prisma.post.create({
    data: {
      title: title.toString(),
      content: content.toString(),
      published: published,
      authorId: user.id,
      images: uploadedFileNames, // Save uploaded file names
    },
  });

  return c.json({ message: "Blog created successfully", blogPost });
});

// Update Blog Handler
export const updateBlogHandler = factory.createHandlers(async (c) => {
  const user = c.var.user; // Get the user ID from the context
  const updatedBody: UpdateBlogSchema = await c.req.json();

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
      authorId: user.id, // Ensure the blog belongs to the user
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

  // Fetch the blog post with the specified ID
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

  // Handle case where the blog post is not found
  if (!blogWithId) {
    c.status(404);
    return c.json({ message: "Blog not found" });
  }

  // Set the base URL for local storage (for development)
  const r2BaseUrl = `https://your-url.r2.dev`; // Replace with your account ID
  // Generate image URLs
  const imageUrls = blogWithId.images?.map((imageName: string) => {
    return `${r2BaseUrl}/${imageName}`; // Construct the full URL for each image
  });

  // Include image URLs in the response
  return c.json({ blog: { ...blogWithId, imageUrls } }); // Return blog post along with image URLs
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

  const user = c.var.user; // Get the user ID from the context
  const { id } = c.req.param("id"); // Get the blog ID from the request body

  // Validate incoming body
  if (!id) {
    c.status(400);
    return c.json({ message: "Blog ID is required" });
  }

  // Check if the blog post exists and belongs to the user
  const existingBlog = await prisma.post.findUnique({
    where: {
      id: id,
      authorId: user.id, // Ensure the blog belongs to the user
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
