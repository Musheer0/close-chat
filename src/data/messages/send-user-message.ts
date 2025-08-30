"use server"
import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";

export async function sendMessage({
  chatId,
  content,
}: {
  chatId: string;
  content: string;
}) {
  const {userId} =await auth()
  if(!userId) throw new Error("Un-authorized")
  // check if user belongs to chat
  const chat = await prisma.chat.findFirst({
    where: { id: chatId ,
      users:{
        some:{
          id:userId
        }
      }
    },
    select:{
      id:true
    }
  });
  if (!chat) throw new Error("Chat not found");
  return prisma.message.create({
    data: {
      sender_id: userId,
      chat_id: chatId,
      type: "USER",
      content:{
        type:"user",
        text:content
      },
    },
  });
}

