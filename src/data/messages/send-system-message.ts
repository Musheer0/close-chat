"use server"
import { MessageContent } from "@/lib/types";
import prisma from "@/prisma";
import { setCache } from "@/redis";

export async function sendSystemMessage({
  userId,
  chatId,
  content,
}: {
  userId: string;
  chatId: string;
  content: MessageContent;
}) {
  const msg =await prisma.message.create({
    data: {
      sender_id: userId, 
      chat_id: chatId,
      type: "SYSTEM",
      content,
    },
  });
  await setCache('system:message:'+chatId+':'+msg.id,msg,60*60);
  return msg
}
