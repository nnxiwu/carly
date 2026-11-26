import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate"
import { hashPassword } from "../auth/password";
import { pool } from "../db";
import { AppError } from "../middleware/errorHandler";
import { DatabaseError } from "pg";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
})

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = await hashPassword(password);
  const sql = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email'
  const values = [email, passwordHash]
  try {
    const result = await pool.query(sql, values)
    const user = result.rows[0]
    res.status(201).json({ id: user.id, email: user.email });
  }
  catch (error) {
    if (error instanceof DatabaseError && error.code === '23505') {
      throw new AppError(409, "email_taken", "The email is already registered")
    }
    throw error;
  }
})