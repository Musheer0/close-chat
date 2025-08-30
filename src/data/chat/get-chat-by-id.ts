"use server";

import { ChatWithUsers } from "@/lib/types";
import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { getCache, setCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";

export async function getChatById(chatId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) throw new Error("Unauthorized");
  const cache = await getCache<ChatWithUsers>(`chat:${chatId}`)
  if(cache?.users){
     if( cache.startedby!==currentUserId && cache.acceptedby!==currentUserId){
      throw new Error("Chat not found");
    }
    return sanitizeChat(cache,currentUserId)
  }
  const chat = await prisma.chat.findFirst({
    where: { id: chatId ,
      users:{
        some:{
          id:currentUserId
        }
      }
    },
    include:  { users:{
      take:2
    } },

  });
  setCache(`chat:${chatId}`,chat)
  if (!chat) throw new Error("Chat not found");

  return sanitizeChat(chat, currentUserId);
}

