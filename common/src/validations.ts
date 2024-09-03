// These are the validation that is going to be pushed over to npm 

// only ".d.ts" is going to be pushed and not these file 

import { z } from "zod";

console.log(z);

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const signinSchema = z.object({
  email: z.string().email(),
});
 const blogSchema = z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
  });
  
   const updateBlogSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
  });
  
export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type BlogSchema = z.infer<typeof blogSchema>;
export type UpdateBlogSchema = z.infer<typeof updateBlogSchema>;
