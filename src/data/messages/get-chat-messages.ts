"use server"

import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getChatMessages(chatId: string, cursorId?: string) {
  const take = 12;
  const { userId: currentUserId } = await auth();
  if (!currentUserId) throw new Error("Unauthorized");

  // check if user is part of this chat
  const isMember = await prisma.chat.findFirst({
    where: {
      id: chatId,
      users: { some: { id: currentUserId } },
    },
    select: { id: true },
  });
  if (!isMember) throw new Error("Forbidden");

  const messages = await prisma.message.findMany({
    where: { chat_id:chatId },
    orderBy: { createdat: "desc" },
    take,
    skip: cursorId ? 1 : 0,
    cursor: cursorId ? { id: cursorId } : undefined,
  });

  return {
    data: messages,
    cursor: messages.length ? messages[messages.length - 1].id : null,
  };
}
