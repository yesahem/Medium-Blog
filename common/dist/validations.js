"use strict";
// These are the validation that is going to be pushed over to npm 
Object.defineProperty(exports, "__esModule", { value: true });
// only ".d.ts" is going to be pushed and not these file 
const zod_1 = require("zod");
console.log(zod_1.z);
const signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const blogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean(),
});
const updateBlogSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean(),
});
