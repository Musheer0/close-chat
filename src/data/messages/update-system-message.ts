"use server";
import { MessageContent } from "@/lib/types";
import prisma from "@/prisma";
import { deleteCache, setCache } from "@/redis";

export async function updateSystemMessage({
  id,
  chatId,
  content
}: {
  id: string;
  chatId: string;
  content?:MessageContent
}) {
  const msg = content ?
  await prisma.message.update({
    where: { id, chat_id: chatId } , 
    data:{
      content:content,
      updatedat:new Date()
    }
  })
  :
  await prisma.message.update({
    where: { id, chat_id: chatId } , 
    data:{
      updatedat:new Date()
    }
  });

  if(!content){
    await deleteCache(`system:message:${chatId}:${id}`);
  }
  else{
    await setCache(`system:message:${chatId}:${id}`,msg,60*60)
  }
  return msg;
}
