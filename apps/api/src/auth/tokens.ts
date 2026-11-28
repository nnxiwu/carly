import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler";

function loadSecret(): string {
  const value = process.env.JWT_ACCESS_SECRET;
  if (!value) {
    throw new Error("JWT_ACCESS_SECRET is not set");
  }
  return value;
}

const secret = loadSecret();

const ACCESS_TOKEN_SECONDS = 15 * 60

export function signAccessToken(userId: string): string {
  return jwt.sign({}, secret, {
    subject: userId,
    expiresIn: ACCESS_TOKEN_SECONDS,
    algorithm: "HS256",
  })
}

export function verifyAccessToken(token: string): string {
  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"]})
    if (typeof payload === "object" && typeof payload.sub === "string") {
      return payload.sub
    }
  } catch {
    // fall through to the 401 below
  }
  throw new AppError(401, "unauthorized", "Invalid or expired token")
}