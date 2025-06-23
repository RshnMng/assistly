"use client";
import { Chatbot } from "@/types/types";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Avatar from "./Avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

function ChatbotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);

  useEffect(() => {
    const sortedArray = [...chatbots].sort((a, b) => {
      return b.chat_sessions.length - a.chat_sessions.length;
    });

    setSortedChatbots(sortedArray);
  }, [chatbots]);

  console.log(chatbots, "chatbots");

  return (
    <>
      <div>
        <Accordion type="single" collapsible>
          {sortedChatbots.map((chatbot) => {
            const hasSessions = chatbot.chat_sessions.length > 0;

            return (
              <AccordionItem
                key={chatbot.id}
                value={`item-${chatbot.id}`}
                className="px-10 py-5"
              >
                {hasSessions ? (
                  <>
                    <AccordionTrigger>
                      <div className="flex text-left items-center w-full">
                        <Avatar
                          seed={chatbot.name}
                          className="h-10 w-10 mr-4"
                        />
                        <p>{chatbot.name}</p>
                        <p className="p-4 font-bold text-right">
                          {chatbot.chat_sessions.length} sessions
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                      {chatbot.chat_sessions.map((session) => {
                        return (
                          <>
                            <Link
                              href={`/review-sessions/${session.id}`}
                              key={session.id}
                              className="relative p-10 bg-[#2991EE] text-white rounded-mb block"
                            >
                              <p className="absolute top-5 right-5 text-sm">
                                {session.guests?.email || "No email provided"}
                              </p>
                              <ReactTimeago
                                date={new Date(session.created_at)}
                              />
                            </Link>
                          </>
                        );
                      })}
                    </AccordionContent>
                  </>
                ) : (
                  <p className="font-light">{chatbot.name} (No sessions)</p>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </>
  );
}
export default ChatbotSessions;
