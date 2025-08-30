import { getChats } from "@/data/chat/get-user-chats";
import { Chat } from "@/lib/types";
import { InfiniteData, useInfiniteQuery} from "@tanstack/react-query";


export type ChatResponse = {
  data: Chat[];
  cursor: string | null;
};

export function useChats() {
  return useInfiniteQuery<
    ChatResponse,             
    Error,                    
    InfiniteData<ChatResponse>,
    [string],                  
    string | undefined         
  >({
    queryKey: ["chats"],
    queryFn: async ({ pageParam }) => getChats(pageParam),
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    initialPageParam: undefined,
    
  });
}
