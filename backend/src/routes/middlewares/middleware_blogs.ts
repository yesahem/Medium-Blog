// import { Hono } from "hono";
// import { blogsRouter } from "../blogs";
// import { verify,sign,decode } from "hono/jwt";
// // blogsRouter.use("/api/v1/blog/*", async (context, next) => {
//  export async function blogMiddleware  (context, next) {
//     console.log("Inside middleware");
//     try {
//       const authHeader = context.req.header("Authorization");
//       if (!authHeader) {
//         context.status(401);
//         return context.json({
//           error: "Unauthorised ",
//         });
//       }
//       const jwtToken = authHeader.split("Bearer ")[1];
//       const verification = await verify(jwtToken, context.env.JWT_SECRET);
//       console.log("Verification",verification);
//       if (!verification) {
//         context.status(403);
//         return context.json({
//           error: "Unauthorised",
//         });
//       }
//       // console.log("Verification is :", verification.name);
  
//       context.set("username", verification.name); // this sets the value of  "username" variable (defined in the hono Variable section) value to the value of "varification.name" [i.e : username = verification.name]
//       // console.log(jwt);
//       await next();
//     } catch (err) {
//       return context.json({
//         error: "Unauthorised",
//       });
//     }
//   });
  