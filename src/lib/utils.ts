import { chat } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChatWithUsers } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeChat(chat: ChatWithUsers, currentUserId: string) {
  const otherUser = chat.users.find((u) => u.id !== currentUserId);

  return {
    id: chat.id,
    type: chat.type,
    createdAt: chat.createdat,
    updatedAt: chat.updatedat,
    isAccepted: chat.isaccepted ?? false,
    startedByMe: chat.startedby === currentUserId,
    user: otherUser ? { id: otherUser.id, username:otherUser.username,image:otherUser.image } : null,
  };
}
