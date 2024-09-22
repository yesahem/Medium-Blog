import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify, sign, jwt } from "hono/jwt";
import { log } from "console";
import { z } from "zod";
import {
  SignupSchema,
  SigninSchema,
} from "@shishuranjan/backend-common/dist/validations";
import { cors } from "hono/cors";
import { EmailMessage } from "cloudflare:email";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
userRouter.use("/*", cors());
// Validation Checks

const signinSchemaUsingZod = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const signupSchemaUsingZod = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Password must contains at least 8 characters"),
});

userRouter.get("/getUserInfo", async (c)=>{
  const auth = c.req.header("Authorization")!;
  const token = auth.split("Bearer ")[1];
  console.log("Token", token);
  try{

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    console.log(`Token in getUserInfo ${token}`);
  const validateToken = await verify(token, c.env.JWT_SECRET);
  console.log(validateToken);
  if (validateToken) {
    const user = await prisma.user.findUnique({
      where: {
        id: validateToken.id,
      },
    });
    console.log(user);
    return c.json({user});
  } else {
    c.status(403);
    return c.json({
      message: "Invalid Token",
    });
  }
}
catch (e) {
  return c.json({
    message:"Something went wrong",
    error: e

  })
}
})


userRouter.post("/signup", async (c) => {
  // To add logics to check if the dataBase have the user with the same email or not if not then create user if yes then return the error that user already exist
  console.log("This is user's signup route");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body: SignupSchema = await c.req.json();

    const isValidCreds = signupSchemaUsingZod.parse(body);

    console.log(`signup cred ${isValidCreds}`);

    if (!isValidCreds) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (userExists) {
      c.status(409);
      return c.json({
        message: "User Already Exists",
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

    console.log(`token: ${token}`);
    return c.json({
      messge: "User created sucessfully ",
      Username: createUser.name,
      Email: createUser.email,
      token: token,
      id: createUser.id,
    });
  } catch (err) {
    console.log(`type of error is ${typeof err}`);
    console.log(`Error (i am backend): ${err} `);
    return c.json({
      messge: "Some Error occured ",
      err: err,
    });
  }
});

userRouter.post("/signin", async (c) => {
  // Add user logic to verify the user JWT and then send the login message

  const headers = c.req.header("Authorization");
  let token;
  console.log(headers);

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body: SigninSchema = await c.req.json();
    const isCredsValid = signinSchemaUsingZod.parse(body);

    console.log(`signin ${isCredsValid} `);



    if (!isCredsValid) {
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
    if(getUser){
      const payload: {id:string} = {
        id: getUser.id
      }
       token = await sign(payload, c.env.JWT_SECRET);
      console.log(`inside the signin payload`, payload)
      console.log("token", token);
      }
      console.log(`signin Route`);
      
    console.log("getuser,", getUser);

    // console.log(getUser);
    if (!getUser) {
      c.status(403);
      return c.json({
        messge: "User Doesn't Exists",
      });
    } else {
      // console.log(getUser);
      return c.json({getUser, token});
    }
  } catch (err) {
    // c.status(403)
    return c.json({
      messge: "Something Went Wrong",
    });
  }
});
