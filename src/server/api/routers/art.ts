import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const inputSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  link: z.string(),
  width: z.number(),
  height: z.number(),
});

export const artRouter = createTRPCRouter({
  allArts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.art.findMany();
  }),
  highlightedArts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.art.findMany({ where: { highlight: true } });
  }),
  addNewArt: publicProcedure.input(inputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.art.create({
      data: {
        ...input,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.art.findFirst({ where: { id: input.id } });
    }),
  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.art.delete({ where: { id: input.id } });
    }),
});
