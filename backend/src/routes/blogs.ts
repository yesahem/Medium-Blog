import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from "hono/cors";
import { decode, verify, sign } from "hono/jwt";
import { z } from "zod";
import { BlogSchema, UpdateBlogSchema } from "@shishuranjan/backend-common/dist/validations";

export const blogsRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userid: string;
  };
}>();

blogsRouter.use("/*", cors())
// middleware
blogsRouter.use("/*", async (context, next) => {
  console.log("This is a middleware route");
  try {
    const authHeader = context.req.header("Authorization");
    if (!authHeader) {
      context.status(401);
      return context.json({
        error: "Unauthorised ",
      });
    }
    const jwtToken = authHeader.split("Bearer ")[1];
    const verification = await verify(jwtToken, context.env.JWT_SECRET);
    console.log("Verification", verification);
    if (!verification) {
      context.status(403);
      return context.json({
        error: "Unauthorised",
      });
    }
    // console.log("Verification is :", verification.name);
    // @ts-ignore
    context.set("userid", verification.id);
    console.log("middleware passes"); // this sets the value of  "userid" variable (defined in the hono Variable section) value to the value of "varification.name" [i.e : username = verification.name]
    // console.log(jwt);
    await next();
  } catch (err) {
    return context.json({
      error: "Unauthorised",
    });
  }
});


// Routes to initialise a blog post
blogsRouter.post("/", async (c) => {
  const userid = c.var.userid;

  // const prisma = new PrismaClient({
  //   datasources:{
  //     db: {url: c.env.DATABASE_URL}
  //   }
  // }).$extends(withAccelerate())

  // OR

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  if (!userid) {
    return c.json({
      mssge: "Unauthorised user ",
    });
  }

  const body: BlogSchema = await c.req.json();

  if (!body) {
    c.status(411);
    return c.json({
      message: "Invalid Inputs",
    });
  }
  console.log(body);
  try {
    const setBlogposts = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
        authorId: userid,
      },
    });
    return c.json({
      messge: "this is blog upload route ",
      userid: userid,
    });
  } catch (err) {
    console.log("Error", err);
    return c.json({
      messge: "Some Error occured while posting blogs ",
    });
  }
});

// Route to update blogs
blogsRouter.put("/", async (c) => {
  const userid = c.var.userid;
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const updatedBody: UpdateBlogSchema = await c.req.json();
    // const {success} = updateBlogSchema.safeParse(updatedBody);
    if (!updatedBody) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs",
      });
    }

    // what console a good error messge if user id provided is invalid to jwt also this is able to update another users blogs fix it by matching with JWT
    const updateBlog = await prisma.post.update({
      where: {
        id: updatedBody.id,
      },
      data: {
        title: updatedBody.title,
        content: updatedBody.content,
        published: updatedBody.published,
      },
    });

    return c.json({
      messge: "Blogs Updated sucessfully ",
    });
  } catch (err) {
    return c.json({
      mssge: "Oops can't update the blog ", err,
    });
  }
});

// This is a route to get all the blogs by given id
blogsRouter.get("/get/:id", async (c) => {
  const param = c.req.param("id");
  console.log("Param given is : ", param);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogWithId = await prisma.post.findFirst({
      where: {
        id: param,
      },
    });
    console.log("Given blog is: ", blogWithId);

    return c.json({
      //name: c.var.userid, // accessing the userid variable using var object inside the context just like we use req,res using context
      // messge: `This is a blog with route id: ${param}`,


      // log messgage that if blogWithId not found then return 404 not found
      Your_Requested_blog_is: blogWithId,
    });
  } catch (err) {
    console.log("Error is :", err);
    return c.json({
      messge: "Oops, Something Went Wrong :(",
    });
  }
});

blogsRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const allPosts = await prisma.post.findMany();
  console.log(allPosts)
  return c.json({
    messge: "This is a route to get all the posts",
    posts: allPosts,
  });
});
