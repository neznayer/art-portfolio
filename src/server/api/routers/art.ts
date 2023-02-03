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
});

export const artRouter = createTRPCRouter({
  allArts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.art
      .findMany()
      .then((res) => res.sort((a, b) => +a.createdAt - +b.createdAt));
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
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.art.findFirst({ where: { id: input.id } });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.art.delete({ where: { id: input.id } });
    }),
});
