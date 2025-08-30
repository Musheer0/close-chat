"use server";

import { ChatResponse } from "@/hooks/use-chats";
import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { getCache, setCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";


export async function createChat(userId: string) {
  const { userId: currentUserId } =await auth();
  if (!currentUserId) throw new Error("Unauthorized");
  if (userId === currentUserId) throw new Error("Can't chat with yourself");

  // check if already exists
  const existing = await prisma.chat.findFirst({
    where: {
      type: "PC",
      users: {
        some: { id: currentUserId },
      },
      AND: {
        users: {
          some: { id: userId },
        },
      },
    },
    include: { users:{
      where:{
        id:{not: userId}
      }
    } },
  });

  if (existing) {
    return sanitizeChat(existing, currentUserId);
  }

  // create new
  const newChat = await prisma.chat.create({
    data: {
      type: "PC",
      isaccepted: false,
      acceptedby: userId,
      startedby: currentUserId,
      users: {
        connect: [{ id: currentUserId }, { id: userId }],
      },
    },
    include: { users:{
      where:{
        id:{not: userId}
      }
    } },
  });
    const cache = await getCache<ChatResponse>(`sanitized:chat:${userId}:cursor:empty`)
    if(cache){
      const new_cache = {...cache,data:[sanitizeChat(newChat,currentUserId),...cache.data]}
      await setCache(`sanitized:chat:${userId}:cursor:empty`,new_cache)
    }
  await setCache(`chat:${newChat.id}`,newChat)
  return sanitizeChat(newChat, currentUserId);
}


