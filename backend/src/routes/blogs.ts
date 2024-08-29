import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from "hono/cors";
import { decode, verify, sign } from "hono/jwt";

export const blogsRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    
  };
  Variables: {
    username: string;
  };
}>();

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

    context.set("username", verification.name); // this sets the value of  "username" variable (defined in the hono Variable section) value to the value of "varification.name" [i.e : username = verification.name]
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
  console.log("this is a post udate route");
  console.log(c);
  const username = c.var.username;
  console.log(username);

  // const prisma = new PrismaClient({
  //   datasources:{
  //     db: {url: c.env.DATABASE_URL}
  //   }
  // }).$extends(withAccelerate())
  // or

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  if (!username) {
    return c.json({
      mssge: "Unauthorised user ",
    });
  }

  const body = await c.req.json();
  console.log(body);
  return c.json({
    messge: "this is blog upload route ",
    userid: username,
  });
});

// Route to update blogs
blogsRouter.put("/", async (c) => {
  return c.json({
    messge: "Hello from blog put route ",
  });
});

// This is a route to get all the blogs by given id
blogsRouter.get("/:id", async (c) => {
  const param = c.req.param("id");

  return c.json({
    name: c.var.username, // accessing the username variable using var object inside the context just like we use req,res using context
    messge: `This is a blog with route id: ${param}`,
  });
});

// Route to get all the posts
blogsRouter.get("/", async (c) => {
  return c.json({
    messge: "This is a route to get all the posts",
  });
});
