"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, use, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import startNewChat from "@/lib/startNewChat";
import Avatar from "@/app/(admin)/components/Avatar";
import { useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql-backup/queries/queries";
import { GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import { GetChatSessionMessagesVariables } from "@/types/types";
import { GetChatSessionMessagesResponse } from "@/types/types";
import Messages from "@/app/(admin)/components/Messages";
import { Chatbot } from "@/types/types";
import { Message } from "@/types/types";

function ChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [chatId, setChatId] = useState(0);
  const [, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const param = use(params);
  const id = Number(param.id);
  const [chatbotData, setChatBot] = useState<Chatbot>();

  const { data, loading } = useQuery(GET_CHATBOT_BY_ID, {
    variables: { id },
  });

  useEffect(() => {
    if (!loading) {
      setChatBot(data.chatbots);
    }
  }, [loading]);

  console.log(chatbotData, "data");

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const chatId = await startNewChat(name, email, Number(id));

    setChatId(chatId);
    setIsLoading(false);
    setIsOpen(false);
  };

  const {
    loading: loadingQuery,
    error,
    data: messageData,
  } = useQuery<GetChatSessionMessagesResponse, GetChatSessionMessagesVariables>(
    GET_MESSAGES_BY_CHAT_SESSION_ID,
    {
      variables: { id: chatId },
      skip: !chatId,
    }
  );

  useEffect(() => {
    if (messageData) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out!</DialogTitle>
              <DialogDescription>
                I just need a few details to get started.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ReadySetGrandma@123.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !email || loading}>
                {!loading ? "Continue" : "Loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#407DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          {chatbotData?.name && (
            <Avatar
              seed={chatbotData.name}
              className="h-12 w-12 bg-white rounded-full border-2 border-white"
            />
          )}

          <div>
            <h1 className="truncate text-lg">{chatbotData?.name}</h1>
            <p className="text-sm text-gray-300">
              *Typically replies instantly
            </p>
          </div>
        </div>

        {chatbotData?.name && (
          <Messages
            messages={messages}
            chatbotName={chatbotData.name}
            chatSessionId={chatId}
          />
        )}
      </div>
    </div>
  );
}
export default ChatbotPage;
