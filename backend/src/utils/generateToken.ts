import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const generateToken = async (
  payload: JWTPayload,
  secret: string
): Promise<string> => {
  return await sign(payload, secret);
};
