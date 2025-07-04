"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { BASE_URL } from "@/graphql/ApolloClient";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";
import Avatar from "../../components/Avatar";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse } from "@/types/types";
import { GetChatbotByIdVariables } from "@/types/types";
import { DELETE_CHATBOT } from "@/graphql/mutations/mutations";
import Characteristic from "../../components/Characteristic";
import { ADD_CHARACTERISTIC } from "@/graphql/mutations/mutations";
import { UPDATE_CHATBOT } from "@/graphql/mutations/mutations";

function EditChatbot() {
  const params = useParams() as { id: string };
  const id = Number(params.id);
  const [url, setUrl] = useState<string>("");
  const [chatbotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState("");

  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const promise = updateChatbot({
        variables: {
          id,
          name: chatbotName,
          created_at: new Date().toISOString(),
        },
      });
      toast.promise(promise, {
        loading: "Updating...",
        success: "Chatbot name updated!",
        error: "Failed to name Chatbot",
      });
    } catch (error) {
      console.log(error, "error message");
    }
  };

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, { variables: { id } });

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      " Are you sure you want to delete this chatbot?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const promise = deleteChatbot({
        variables: { id },
      });
      toast.promise(promise, {
        loading: "Deleting...",
        success: "Chatbot Succesfully deleted!",
        error: "Failed to delete chatbot",
      });
    } catch (error) {
      console.log(`Error deleting chatbot: ${error}`);
      toast.error("Failed to delete chatbot");
    }
  };

  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: id,
          content,
          created_at: new Date().toISOString(),
        },
      });

      toast.promise(promise, {
        loading: "Adding...",
        success: "Information Added!",
        error: "Failied to add information",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add information");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto animate-spin p-10">
        <Avatar seed="PAPAFAM Support Agent" />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  if (!data?.chatbots) return redirect("/view-chatbots");

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
            target="_blank"
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
      <section className="relative mt-5 bg-blue-200 p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-2 cursor-pointer hover:opacity-75"
          onClick={() => handleDelete(id)}
        >
          x
        </Button>
        <div>
          <Avatar seed={chatbotName} />
          <form onSubmit={(e) => handleChatbot(e)}>
            <Input
              value={chatbotName}
              onChange={(e) => {
                setChatbotName(e.target.value);
              }}
              placeholder={chatbotName}
              className="w-56 border-none bg-white my-4 text-xl font-bold"
              required
            />
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={!chatbotName}
            >
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

        <div className="p-5 md:p-5 rounded-md mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Example: if a customer asks for prices, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="bg-white"
            />
            <Button
              type="submit"
              disabled={!newCharacteristic}
              className="cursor-pointer"
            >
              Add
            </Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-5">
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
