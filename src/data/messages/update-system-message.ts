"use server";
import prisma from "@/prisma";
import { deleteCache } from "@/redis";

export async function updateSystemMessage({
  id,
  chatId,
}: {
  id: string;
  chatId: string;
}) {
  const msg = await prisma.message.update({
    where: { id, chat_id: chatId } , 
    data:{
      updatedat:new Date()
    }
  });

  await deleteCache(`system:message:${chatId}:${id}`);
  return msg;
}
