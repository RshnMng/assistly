"use client";

import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";

function Messages({
  messages,
  chatbotName,
  chatSessionId,
}: {
  messages: Message[];
  chatbotName: string;
  chatSessionId: number;
}) {
  const path = usePathname();
  const isReviewsPage = path.includes("/review-sessions");
  return (
    <div>
      {messages.map((message) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`${
              isSender
                ? "chat-bubble-secondary bg-blue-700  text-gray-300 rounded"
                : "chat-bubble-primary bg-blue-300 text-blue-900 rounded justify-end"
            } relative flex m-6 p-2`}
          >
            {isReviewsPage && (
              <p className="absolute -bottom-5 text-xs text-purple-800">
                {" "}
                sent: {new Date(message.created_at).toLocaleString()}
              </p>
            )}
            <div>
              {isSender ? (
                <div className="flex">
                  <Avatar
                    seed={chatbotName}
                    className="h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]"
                  />
                  <p className="pt-3 ml-2">whats good?</p>
                </div>
              ) : (
                <div className="flex">
                  <p>yooo</p>
                  <UserCircle className="text-[2991EE] ml-3" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Messages;
