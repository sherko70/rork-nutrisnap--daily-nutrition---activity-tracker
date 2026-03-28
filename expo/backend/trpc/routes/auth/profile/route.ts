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

export const profileProcedure = publicProcedure
  .input(z.object({
    token: z.string(),
  }))
  .query(({ input }) => {
    // Extract user ID from token (in production, verify JWT token)
    const userId = input.token.split('_')[1];
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });