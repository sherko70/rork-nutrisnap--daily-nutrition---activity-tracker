import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

// Mock nutrition data storage - in production, use a real database
const nutritionData: Record<string, {
  goals: { calories: number; protein: number };
  history: Record<string, {
    date: string;
    totalCalories: number;
    totalProtein: number;
    foods: Array<{
      id: string;
      name: string;
      calories: number;
      protein: number;
      timestamp: number;
      quantity?: number;
    }>;
  }>;
}> = {};

export default publicProcedure
  .input(z.object({
    token: z.string(),
  }))
  .query(({ input }) => {
    // Extract user ID from token (in production, verify JWT token)
    const userId = input.token.split('_')[1];
    
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }

    // Get nutrition data for user
    const data = nutritionData[userId];
    
    return {
      goals: data?.goals || { calories: 2000, protein: 120 },
      history: data?.history || {},
    };
  });