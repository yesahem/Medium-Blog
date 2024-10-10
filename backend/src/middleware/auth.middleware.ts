import { verify } from "hono/jwt";
import { createFactory } from "hono/factory";
const factory = createFactory();

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { message: "Authorization header is missing or malformed" },
      401
    );
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json({ message: "Invalid or expired token" }, 403);
  }
});
