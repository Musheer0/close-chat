"use server"
import { ChatWithUsers } from "@/lib/types";
import prisma from "@/prisma";
import { getCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";
import { updateSystemMessage } from "./update-system-message";

export async function endCall({
  chatId,
  id
}: {
  chatId: string;
  id:string;
}) {
  const {userId} =await auth()
  if(!userId) throw new Error("Un-authorized")
  const cache = await getCache<ChatWithUsers>(`chat:${chatId}`)
  if(cache){
    console.log(cache)
    if( cache.startedby!==userId && cache.acceptedby!==userId){
      throw new Error("Chat not found");
    }
  }
  else{
    const chat = await prisma.chat.findFirst({
    where: { id: chatId, 
      users:{
        some:{
          id:userId
        }
      }

    },
  });

  if (!chat) throw new Error("Chat not found");
  }
  const call = await updateSystemMessage({id,chatId})
  return call
}

