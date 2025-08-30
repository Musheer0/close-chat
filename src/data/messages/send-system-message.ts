"use server"
import { MessageContent } from "@/lib/types";
import prisma from "@/prisma";

export async function CreateSystemMessage({
  userId,
  chatId,
  content,
}: {
  userId: string;
  chatId: string;
  content: MessageContent;
}) {
  return prisma.message.create({
    data: {
      sender_id: userId, 
      chat_id: chatId,
      type: "SYSTEM",
      content,
    },
  });
}
