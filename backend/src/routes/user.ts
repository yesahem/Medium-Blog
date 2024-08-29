import { Context,Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify, sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    username: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const createUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
        // posts: body.posts,
      },
    });

    const payload = {
      name: body.name,
      email: body.email,
    };
    const token = await sign(payload, c.env.JWT_SECRET);

    console.log(token);
    return c.json({
      messge: "User created sucessfully ",
      Username: createUser.name,
      Email: createUser.email,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return c.json({
      messge: "Some Error occured ",
    });
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const getUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // console.log(getUser);
    if (!getUser) {
      c.status(403);
      return c.json({
        messge: "User Doesn't Exists",
      });
    } else {
      return c.json({
        messge: "user Login Sucessfull",
      });
    }
  } catch (err) {
    // c.status(403)
    return c.json({
      messge: "Something Went Wrong",
    });
  }
});

