"use server";

import { ChatResponse } from "@/hooks/use-chats";
import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { getCache, setCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";


export async function getChats(cursorId?: string, ) {
    const take = 20
  const { userId: currentUserId } =await auth();
  if (!currentUserId) throw new Error("Unauthorized");
  const cache =await getCache<ChatResponse>(`sanitized:chat:${currentUserId}:cursor:${cursorId||'empty'}`)
  if(cache){
    console.log('cache cursor hit------------',cursorId||'empty')
    if(cache.data.length>0){
       return cache
    }
  }
  const chats = await prisma.chat.findMany({
    where: { users: { some: { id: currentUserId } } },
    include: { users:{
     take:2
    } },
    orderBy: { createdat: "desc" },
    take,
    skip: cursorId ? 1 : 0,
    cursor: cursorId ? { id: cursorId } : undefined,
  });
  for (const chat of chats){
    await setCache(`chat:${chat.id}`,chat)
  }
  const return_data = {
    data: chats.map((c) => sanitizeChat(c, currentUserId)),
    cursor: chats.length ? chats[chats.length - 1].id : null,
  };
  await setCache(`sanitized:chat:${currentUserId}:cursor:${cursorId||'empty'}`,return_data)
  return return_data
}
