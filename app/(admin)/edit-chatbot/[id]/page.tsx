"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/graphql/ApolloClient";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Avatar from "../../components/Avatar";
import { useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse } from "@/types/types";
import { GetChatbotByIdVariables } from "@/types/types";
import Characteristic from "../../components/Characteristic";

function EditChatbot() {
  const params = useParams() as { id: string };
  const id = Number(params.id);
  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState("");

  const { data } = useQuery<GetChatbotByIdResponse, GetChatbotByIdVariables>(
    GET_CHATBOT_BY_ID,
    { variables: { id } }
  );

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }

    console.log(data, "use effect data");
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);

  return (
    <div className="px-0 md:p-10">
      <div className="md:sticky md:top-8 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]">
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations with your
          chatbot
        </p>
        <div className="flex items-center space-x-2">
          <Link
            href={url}
            className="w-full cursor-pointer hover:opacity-50% bg-white"
          >
            <Input value={url} readOnly className="cursor-pointer" />
          </Link>
          <Button
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Copied to clipboard");
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section className="relative mt-5 bg-pink-400 p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-2"
          // onClick={() => handleDelete(id)}
        >
          x
        </Button>
        <div className="flex space-x-4">
          <Avatar seed={chatbotName} />
          <form>
            <Input
              value={chatbotName}
              onChange={(e) => {
                setChatbotName(e.target.value);
              }}
              placeholder={chatbotName}
              className="w-full border-none bg-transparent text-xl font-bold"
              required
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>

        <h2 className="text-xl font-bold mt-10">
          Here is what your AI knows...
        </h2>
        <p>
          Your chatbot is equipped with the following information to assist you
          in your conversation with you customers and users
        </p>

        <div>
          <form>
            <Input
              type="text"
              placeholder="Example: if a customer asks for prices, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>
          <ul>
            {data?.chatbots.chatbot_characteristics.map((characteristic) => {
              return (
                <Characteristic
                  key={characteristic.id}
                  characteristic={characteristic}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
export default EditChatbot;
