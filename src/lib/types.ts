import { chat_type, Prisma } from "@prisma/client";

export type ChatWithUsers = Prisma.chatGetPayload<{
  include: {
    users: true;
  };
}>;

export type Chat = {
  id: string;
  type: chat_type;
  createdAt: Date;
  updatedAt: Date;
  isAccepted: boolean;
  startedByMe: boolean;
  user: {
    id: string;
    username: string;
    image: string | null;
  } | null;
};

export type publicUser={
     username:string,
            email?:string,
            image:string|null,
            id?:string
}
export type MessageContent = {
  type: "system" | "text";
  icon?: "none" | "video" | "phone";
  text: string;
};
