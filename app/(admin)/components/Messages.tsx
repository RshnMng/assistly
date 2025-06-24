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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useEffect } from "react";

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
  const user = useUser();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  console.log(user, "this is user");
  return (
    <div className=" flex flex-col md:max-w-3xl lg:min-w-3xl lg:self-center overflow-y-auto">
      {messages.map((message) => {
        const isSender = message.sender !== "user";
        console.log(message, "sane check - message");

        return (
          <div
            key={message.id}
            className={`${
              isSender
                ? "chat-bubble-secondary bg-blue-700  text-gray-300 rounded max-w-sm"
                : "chat-bubble-primary bg-blue-300 text-blue-900 rounded justify-end self-end max-w-sm"
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

                  <p className="pt-3 ml-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: ({ node, ...props }) => {
                          return (
                            <ul
                              {...props}
                              className="list-disc list-inside ml-5 mb-5"
                            />
                          );
                        },
                        ol: ({ node, ...props }) => {
                          return (
                            <ol
                              {...props}
                              className="list-decimal list-inside ml-5 mb-5"
                            />
                          );
                        },
                        h1: ({ node, ...props }) => {
                          return (
                            <h1
                              {...props}
                              className="text-2xl font-bold mb-5"
                            />
                          );
                        },
                        h2: ({ node, ...props }) => {
                          return (
                            <h2 {...props} className="text-xl font-bold mb-5" />
                          );
                        },
                        h3: ({ node, ...props }) => {
                          return (
                            <h3
                              {...props}
                              className="text-lg front-bold mb-5"
                            />
                          );
                        },
                        table: ({ node, ...props }) => {
                          return (
                            <table
                              {...props}
                              className="table-auto w-full border-separate borrder-2 rounded-sm border-spacing-r border-white mb-5"
                            />
                          );
                        },
                        th: ({ node, ...props }) => {
                          return (
                            <th {...props} className="text-left underline" />
                          );
                        },

                        a: ({ node, ...props }) => {
                          return (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline hover:text-blue-400"
                            />
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <p className="mr-3 pt-1">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: ({ node, ...props }) => {
                          return (
                            <ul
                              {...props}
                              className="list-disc list-inside ml-5 mb-5"
                            />
                          );
                        },
                        ol: ({ node, ...props }) => {
                          return (
                            <ol
                              {...props}
                              className="list-decimal list-inside ml-5 mb-5"
                            />
                          );
                        },
                        h1: ({ node, ...props }) => {
                          return (
                            <h1
                              {...props}
                              className="text-2xl font-bold mb-5"
                            />
                          );
                        },
                        h2: ({ node, ...props }) => {
                          return (
                            <h2 {...props} className="text-xl font-bold mb-5" />
                          );
                        },
                        h3: ({ node, ...props }) => {
                          return (
                            <h3
                              {...props}
                              className="text-lg front-bold mb-5"
                            />
                          );
                        },
                        table: ({ node, ...props }) => {
                          return (
                            <table
                              {...props}
                              className="table-auto w-full border-separate borrder-2 rounded-sm border-spacing-r border-white mb-5"
                            />
                          );
                        },
                        th: ({ node, ...props }) => {
                          return (
                            <th {...props} className="text-left underline" />
                          );
                        },
                        a: ({ node, ...props }) => {
                          return (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold underline hover:text-blue-400"
                            />
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </p>
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
