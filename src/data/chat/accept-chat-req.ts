"use server";

import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";
export async function acceptChat(chatId: string) {
  const { userId: currentUserId } =await  auth();
  if (!currentUserId) throw new Error("Unauthorized");

  const chat = await prisma.chat.findFirst({
    where: { id: chatId, 
      users:{
        some:{
          id:currentUserId
        }
      }

    },
  });

  if (!chat) throw new Error("Chat not found");


  const updated = await prisma.chat.update({
    where: { id: chatId },
    data: {
      isaccepted: true,
      isacceptedat: new Date(),
      acceptedby: currentUserId,
    },
    include:  { users:{
      where:{
        id:{not: currentUserId}
      }
    } },
  });

  return sanitizeChat(updated, currentUserId);
}
