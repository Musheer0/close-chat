"use server";

import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getChatById(chatId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) throw new Error("Unauthorized");

  const chat = await prisma.chat.findFirst({
    where: { id: chatId ,
      users:{
        some:{
          id:currentUserId
        }
      }
    },
    include:  { users:{
      where:{
        id:{not: currentUserId}
      }
    } },
  });

  if (!chat) throw new Error("Chat not found");

  return sanitizeChat(chat, currentUserId);
}

