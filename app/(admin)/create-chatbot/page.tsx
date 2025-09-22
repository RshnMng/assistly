"use client";

import { Button } from "@/components/ui/button";
import Avatar from "../components/Avatar";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function CreateChatbot() {
  const { user, isLoaded } = useUser();

  const [name, setName] = useState("");
  const router = useRouter();

  const [CreateChatbot, { loading }] = useMutation(CREATE_CHATBOT, {
    variables: {
      clerk_user_id: user?.id,
      name,
      created_at: new Date().toISOString(),
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return <p>Loading user...</p>;
    }

    if (!user) {
      router.push(
        "https://relative-swift-94.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fcreate-chatbot"
      );
      return;
    }

    try {
      const data = await CreateChatbot();
      setName("");
      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch (error) {
      console.log(error, "error message");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
      <Avatar seed="create-chatbot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers.
        </h2>
        <form
          className="flex flex-col md:flex-row gap-2 mt-5"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Chatbot Name"
            className="max-w-lg"
            type="text"
            required
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              const capitalized = value.replace(
                /\w\S*/g,
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              );

              console.log(capitalized, "caps");
              setName(capitalized);
            }}
          />
          <Button
            type="submit"
            disabled={loading || !name}
            className="cursor-pointer"
          >
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}
export default CreateChatbot;
