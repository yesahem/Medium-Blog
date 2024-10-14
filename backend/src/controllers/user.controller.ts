import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { z } from "zod";
import { createFactory } from "hono/factory";
import {
  SignupSchema,
  SigninSchema,
} from "@shishuranjan/backend-common/dist/validations";
import { generateToken } from "../utils/generateToken";
import bcrypt from 'bcryptjs'

// Define factory and schema
const factory = createFactory();

const signinSchemaUsingZod = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchemaUsingZod = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

// Sign Up Handler
export const signUpHandler = factory.createHandlers(async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body: SignupSchema = await c.req.json();
    const isValidCreds = signupSchemaUsingZod.safeParse(body);

    if (!isValidCreds.success) {
      c.status(411);
      return c.json({ message: "Inputs are not correct" });
    }

    const userExists = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userExists) {
      c.status(409);
      return c.json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const createUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    });

    const payload = { id: createUser.id };
    const token = await generateToken(payload, c.env.JWT_SECRET);

    return c.json({
      message: "User created successfully",
      Username: createUser.name,
      Email: createUser.email,
      token,
      id: createUser.id,
    });
  } catch (err:any) {
    console.error("Error during sign-up:", err.message);
    return c.json({ message: "Some error occurred", err: err.message });
  }
});

// Sign In Handler
export const signInHandler = factory.createHandlers(async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const isValidCreds = signinSchemaUsingZod.safeParse(body);

    if (!isValidCreds.success) {
      c.status(411);
      return c.json({ message: "Inputs are not correct" });
    }

    const getUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!getUser) {
      c.status(403);
      return c.json({ message: "User Doesn't Exist" });
    }

    console.log(getUser);
    

    const isPasswordValid = await bcrypt.compare(body.password, getUser.password);

    if (!isPasswordValid) {
      c.status(403);
      return c.json({ message: "Invalid password" });
    }
    
    const payload = { id: getUser.id , email: getUser.email};
    console.log(payload);
    
    const token = await generateToken(payload, c.env.JWT_SECRET);
    console.log(token);

    return c.json({ getUser, token });
  } catch (err: any) {
    return c.json({ message: "Something went wrong", error: err.message });  // Return detailed error
  }
});

// Get User Info Handler (Protected route using middleware)
export const getUserInfoHandler = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authenticatedUser = c.get("user");

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(authenticatedUser.id) },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (e) {
    return c.json({ message: "Something went wrong", error: e });
  }
});
