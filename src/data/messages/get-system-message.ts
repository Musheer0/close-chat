"use server";

import prisma from "@/prisma";
import { getCache, setCache } from "@/redis";
import { message } from "@prisma/client";

export async function getSystemMessage({ id, chatId }: { id: string; chatId: string }) {
  const cacheKey = `system:message:${chatId}:${id}`;

  const cached = await getCache<message>(cacheKey);
  if (cached) return cached;

  const msg = await prisma.message.findFirst({
    where: { id, chat_id: chatId, type: "SYSTEM" },
  });

  if (msg) await setCache(cacheKey, msg, 60 * 60); // cache for 1 hour
  return msg;
}
