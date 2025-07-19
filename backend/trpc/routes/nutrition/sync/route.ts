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
    goals: z.object({
      calories: z.number(),
      protein: z.number(),
    }),
    history: z.record(z.string(), z.object({
      date: z.string(),
      totalCalories: z.number(),
      totalProtein: z.number(),
      foods: z.array(z.object({
        id: z.string(),
        name: z.string(),
        calories: z.number(),
        protein: z.number(),
        timestamp: z.number(),
        quantity: z.number().optional(),
      })),
    })),
  }))
  .mutation(({ input }) => {
    // Extract user ID from token (in production, verify JWT token)
    const userId = input.token.split('_')[1];
    
    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }

    // Store nutrition data for user
    nutritionData[userId] = {
      goals: input.goals,
      history: input.history,
    };

    return { success: true };
  });