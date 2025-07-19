import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

// Mock user database - in production, use a real database
const users: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}> = [];

export default publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
  }))
  .mutation(({ input }) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === input.email);
    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: input.email,
      password: input.password, // In production, hash this password
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // Generate mock token
    const token = `token_${newUser.id}_${Date.now()}`;

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      token,
    };
  });