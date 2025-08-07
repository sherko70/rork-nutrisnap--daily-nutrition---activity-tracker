import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { signupProcedure } from "./routes/auth/signup/route";
import { loginProcedure } from "./routes/auth/login/route";
import { profileProcedure } from "./routes/auth/profile/route";
import { syncProcedure } from "./routes/nutrition/sync/route";
import { getProcedure } from "./routes/nutrition/get/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  auth: createTRPCRouter({
    signup: signupProcedure,
    login: loginProcedure,
    profile: profileProcedure,
  }),
  nutrition: createTRPCRouter({
    sync: syncProcedure,
    get: getProcedure,
  }),
});

export type AppRouter = typeof appRouter;