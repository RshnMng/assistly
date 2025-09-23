"use client";

import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  ShadAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Markdown from "./Markdown";
import { useRef, useEffect } from "react";

function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
  chatSessionId: number;
}) {
  const path = usePathname();
  const isReviewsPage = path.includes("/review-sessions");
  const user = useUser();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" flex flex-col md:max-w-3xl max-w-[527px] lg:self-center bg-blue-100">
      {messages.map((message) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`${
              isSender
                ? "chat-bubble-secondary bg-blue-800  text-gray-300 rounded-3xl max-w-sm pl-12 pr-6 pb-4"
                : "chat-bubble-primary bg-blue-300 text-blue-900 rounded-2xl justify-end self-end max-w-sm py-2 pl-5 pr-2"
            } relative flex m-6 font-bold `}
          >
            {isReviewsPage && (
              <p className="absolute -bottom-5 text-xs text-purple-800">
                {" "}
                sent: {new Date(message.created_at).toLocaleString()}
              </p>
            )}
            <div>
              {isSender ? (
                <div className="flex pb-1">
                  <Avatar
                    seed={chatbotName}
                    className="h-9 w-10 bg-white rounded-full border-2 border-[#2991EE] absolute top-3 left-2"
                  />

                  <div className="pt-4 ml-2">
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="mr-3 pt-1">
                    <Markdown>{message.content}</Markdown>

                    {/* wrap markdown around message content */}
                  </div>
                  <ShadAvatar>
                    <AvatarImage src={user.user?.imageUrl} />
                    <AvatarFallback>
                      <UserCircle />
                    </AvatarFallback>
                  </ShadAvatar>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={ref}></div>
    </div>
  );
}
export default Messages;
