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
import { GetChatSessionMessagesIdVariables } from "@/types/types";
import { GetChatSessionMessagesResponse } from "@/types/types";
import Messages from "@/app/(admin)/components/Messages";
import { Chatbot } from "@/types/types";
import { Message } from "@/types/types";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

function ChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [chatId, setChatId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const param = use(params);
  const id = Number(param.id);
  const [chatbotData, setChatBot] = useState<Chatbot>();

  const formSchema = z.object({
    message: z.string().min(2, "Your Message is too short!"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data, loading } = useQuery(GET_CHATBOT_BY_ID, {
    variables: { id },
  });

  useEffect(() => {
    if (!loading) {
      setChatBot(data.chatbots);
    }
  }, [loading]);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("handle information is running");

    const chatId = await startNewChat(name, email, Number(id));

    setChatId(chatId);
    setIsLoading(false);
    setIsOpen(false);
  };

  const {
    loading: loadingQuery,
    error,
    data: messageData,
  } = useQuery<
    GetChatSessionMessagesResponse,
    GetChatSessionMessagesIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
  });

  useEffect(() => {
    if (!loadingQuery && messageData) {
      setMessages(messageData.chat_sessions.messages);
      console.log(error, "error");
    }
  }, [loadingQuery]);

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
              <Button type="submit" disabled={!name || !email || isLoading}>
                {!isLoading ? "Continue" : "Loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
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

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {chatbotData?.name && (
            <Messages
              messages={messages}
              chatbotName={chatbotData.name}
              chatSessionId={chatId}
            />
          )}
        </div>
        <Form {...form}>
          <form className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 lg-gray-100 rounded-md">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="sr-only">message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type a message..."
                        {...field}
                        className="p-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" className="h-full">
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
export default ChatbotPage;
