"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chat } from "@/lib/types";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChatMessage from "./chat-message";
import { useSocket } from "@/components/providers/global/socket-provider";
import { useUser } from "@clerk/nextjs";
import { message } from "@prisma/client";
import { updateChatCache } from "@/lib/cache/update-messages-cache";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CallToast from "@/components/call/call-toast";

const ChatBody = ({ chat }: { chat: Chat }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useChatMessages(chat.id);

  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient =useQueryClient()
  const [scrollUp, setScrollUp] = useState(false);
  const user = useUser()
  const socket = useSocket()
  const messages = data?.pages.flatMap((page) => page.data) ?? [];
  const [isTyping ,setIsTyping] =useState(false)
  // Scroll handling
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 10;

    if (isAtBottom) {
      setScrollUp(false); // user reached the bottom
    } else {
      setScrollUp(true); // user scrolled up
    }
  };


  const handleSocketFocus = (data:string)=>{
    if(data!==user.user?.id){
      setIsTyping(true)
    }
  }
  const handleSocketBlur = (data:string)=>{
    if(data!==user.user?.id){
      setIsTyping(false)
    }
  }
  const handleReciveMessag =(data:message)=>{
    if(data.sender_id!==user.user?.id){
      updateChatCache(queryClient,chat.id,data)
    }
  }
  const handelRingCall=(data:{call_id:string,user:{username:string,id:string}})=>{
    console.log(data)
    toast(<CallToast chat={chat} data={data}/>,{duration:30000})
  }
  // Auto scroll when messages change, but only if not scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container || scrollUp) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, scrollUp]);
  //socket events
  useEffect(()=>{
    socket.on(`chat:input:focus:${chat.id}`,handleSocketFocus)
    socket.on(`chat:input:blur:${chat.id}`,handleSocketBlur)
    socket.on(`chat:message:${chat.id}`,handleReciveMessag)
    socket.on(`${user.user?.id}:ring`,handelRingCall)
    return ()=>{
    socket.off(`chat:input:focus:${chat.id}`,handleSocketFocus)
    socket.off(`chat:input:blur:${chat.id}`,handleSocketBlur)
    socket.off(`chat:message:${chat.id}`,handleReciveMessag)
    socket.off(`${user.user?.id}:ring`,handelRingCall)
    }
  },[socket])

  if (status === "pending")
    return <div className="w-full flex-1 p-3">Loading messages...</div>;
  if (status === "error")
    return (
      <div className="w-full flex-1 p-3 text-red-600">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full flex-1 overflow-y-auto p-4 space-y-2"
    >

      {messages.length === 0 && (
        <p className="text-gray-500 text-sm">No messages yet…</p>
      )}

      {chat.startedByMe && !chat.isAccepted && (
        <Alert>
          <AlertTitle>
            {chat.user?.username} has not accepted your request yet
          </AlertTitle>
          <AlertDescription>
            They won’t be able to see or get notified about your message until
            they accept
          </AlertDescription>
        </Alert>
      )}

      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="text-blue-500 mx-auto text-sm mt-2"
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}

      {messages.reverse().map((msg) => (
        <React.Fragment key={msg.id}>
          <ChatMessage msg={msg} chat={chat} />
        </React.Fragment>
      ))}
      {`${user.user?.id}:ring`}
      {isTyping &&
      <p className="bg-muted-foreground/10 flex items-center gap-1 p-4  rounded-2xl rounded-bl-none mr-auto w-fit">
      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground/50"></div>
      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground/50"></div>
      <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground/50"></div>
      </p>
      }
    </div>
  );
};

export default ChatBody;
