import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { ChatMessageResponse } from "@/hooks/use-chat-messages";
import { message } from "@prisma/client";

/**
 * Updates the react-query cache for chat messages
 * @param queryClient - react-query QueryClient instance
 * @param chatId - ID of the chat
 * @param newMessage - The new message to prepend
 */
export const updateChatCache = (
  queryClient: QueryClient,
  chatId: string,
  newMessage: message
) => {
  queryClient.setQueryData<InfiniteData<ChatMessageResponse>>(
    ["chat-messages-" + chatId],
    (oldData) => {
      if (!oldData) {
        return {
          pages: [{ data: [newMessage], cursor: null }],
          pageParams: [],
        };
      }

      const newPages = oldData.pages.map((page, idx) =>
        idx === 0
          ? { ...page, data: [newMessage, ...page.data] }
          : page
      );

      return { ...oldData, pages: newPages, pageParams: [...oldData.pageParams] };
    }
  );
};
