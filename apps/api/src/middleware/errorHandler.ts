import type { NextFunction, Request, Response } from "express";

// Throw this from anywhere to send a specific error to the client.
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// Runs when no route matched the request.
export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    error: { code: "not_found", message: "Route not found" },
  });
}

// Runs when anything throws an error.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res
      .status(err.status)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error(err);
  res.status(500).json({
    error: { code: "internal_error", message: "Something went wrong" },
  });
}