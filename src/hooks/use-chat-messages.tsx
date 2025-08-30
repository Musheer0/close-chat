import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { $Enums, Prisma } from "@prisma/client";
import { getChatMessages } from "@/data/messages/get-chat-messages";

export type ChatMessageResponse = {
  data: {
    id: string;
    type: $Enums.message_type;
    createdat: Date;
    updatedat: Date;
    sender_id: string;
    chat_id: string;
    content: Prisma.JsonValue;
  }[];
  cursor: string | null;
};

export function useChatMessages(chatId: string) {
  return useInfiniteQuery<
    ChatMessageResponse,               // what API returns
    Error,                             // error type
    InfiniteData<ChatMessageResponse>, // data shape across pages
    [string],                  // queryKey type
    string | undefined                 // pageParam type
  >({
    queryKey: ["chat-messages-"+chatId],
    queryFn: async ({ pageParam }) =>
      getChatMessages(chatId, pageParam),
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    initialPageParam: undefined,
  });
}
