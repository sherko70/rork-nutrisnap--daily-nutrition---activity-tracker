import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import signupRoute from "./routes/auth/signup/route";
import loginRoute from "./routes/auth/login/route";
import profileRoute from "./routes/auth/profile/route";
import syncNutritionRoute from "./routes/nutrition/sync/route";
import getNutritionRoute from "./routes/nutrition/get/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    signup: signupRoute,
    login: loginRoute,
    profile: profileRoute,
  }),
  nutrition: createTRPCRouter({
    sync: syncNutritionRoute,
    get: getNutritionRoute,
  }),
});

export type AppRouter = typeof appRouter;