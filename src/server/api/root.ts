import { createTRPCRouter } from "./trpc";
import { artRouter } from "./routers/art";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  art: artRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
