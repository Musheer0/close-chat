"use server";
import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";
export async function rejectChat(chatId: string) {
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
  await prisma.chat.deleteMany({
    where:{
        id:chatId
    }
  })

  return chatId
}
