import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify, sign } from "hono/jwt";
import { log } from "console";
import { z } from "zod";
import {SignupSchema, SigninSchema,} from "@shishuranjan/backend-common/dist/validations";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Validation Checks

userRouter.post("/signup", async (c) => {
  console.log("This is user's signup route");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body :SignupSchema= await c.req.json();

    if (!body) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs",
      });
    }
    const createUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
      },
    });
    console.log("Create User : ", createUser);
    console.log("User id : ", createUser.id);
    const payload = {
      id: createUser.id,
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
  // Add user logic to verify the user JWT and then send the login message

  const headers = c.req.header("Authorization");
  console.log(headers);

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body:SigninSchema = await c.req.json();

    if (!body) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs",
      });
    }
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
