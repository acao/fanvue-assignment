import { prismaClient } from "../../prisma/prismaClient";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC.create({
  transformer: superjson,
});

export const trpcRouter = t.router({
  // example endpoint...
  getPosts: t.procedure
    .input(
      z
        .object({
          skip: z.number().optional(),
          take: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      // TODO: infinite loading, or 
      // something else to limit the request size to what is needed
      return {
        posts: await prismaClient.post.findMany({
          where: {
            published: true,
          },
          skip: input?.skip || 0,
          take: input?.take || 14,
        
          include: {
            _count: {
              select: { comments: true },
            },
          },
        }),
        
        totalCount: await prismaClient.post.count({
          where: {
            published: true,
          },
        }),
      };
    }),
  getComments: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await prismaClient.comment.findMany({
        where: {
          postId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  addComment: t.procedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // error handling  if content or postId is not supplied
      return await prismaClient.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
        },
      });
    }),
});

export type TrpcRouter = typeof trpcRouter;
