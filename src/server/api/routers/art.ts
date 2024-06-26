import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const inputSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  link: z.string(),
  width: z.number(),
  height: z.number(),
  highlight: z.boolean().optional(),
  key: z.string(),
});

export const artRouter = createTRPCRouter({
  allArts: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.art
      .findMany()
      .then((res) => res.sort((a, b) => +a.createdAt - +b.createdAt));
    return data;
  }),

  highlightedArts: publicProcedure
    .input(z.object({ tag: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      if (input?.tag) {
        return ctx.prisma.art.findMany({
          where: { highlight: true, tags: { has: input.tag } },
        });
      }

      return ctx.prisma.art.findMany({ where: { highlight: true } });
    }),
  addNewArt: protectedProcedure
    .input(inputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.art.create({
        data: {
          ...input,
        },
      });
    }),
  addHighLight: protectedProcedure
    .input(z.object({ id: z.string(), highlight: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.art.update({
        where: { id: input.id },
        data: { highlight: input.highlight },
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.id) {
        return null;
      }
      return ctx.prisma.art.findFirst({ where: { id: input.id } });
    }),
  allTags: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.art
      .findMany()
      .then((found) => [...new Set(found.flatMap((f) => f.tags))]);
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.art.delete({ where: { id: input.id } });
    }),
});
