"use server";

import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getChats(cursorId?: string, ) {
    const take = 20
  const { userId: currentUserId } =await auth();
  if (!currentUserId) throw new Error("Unauthorized");

  const chats = await prisma.chat.findMany({
    where: { users: { some: { id: currentUserId } } },
    include: { users:{
      where:{
        id:{not: currentUserId}
      }
    } },
    orderBy: { createdat: "desc" },
    take,
    skip: cursorId ? 1 : 0,
    cursor: cursorId ? { id: cursorId } : undefined,
  });

  return {
    data: chats.map((c) => sanitizeChat(c, currentUserId)),
    cursor: chats.length ? chats[chats.length - 1].id : null,
  };
}
