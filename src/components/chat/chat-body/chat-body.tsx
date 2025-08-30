"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chat } from "@/lib/types";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChatMessage from "./chat-message";

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
  const [scrollUp, setScrollUp] = useState(false);

  const messages = data?.pages.flatMap((page) => page.data) ?? [];

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

  // Auto scroll when messages change, but only if not scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container || scrollUp) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, scrollUp]);

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
    </div>
  );
};

export default ChatBody;
