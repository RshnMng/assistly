"use client";

import { Button } from "@/components/ui/button";
import Avatar from "../components/Avatar";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import { CREATE_CHATBOT } from "@/graphql/mutations/ mutations";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function CreateChatbot() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();

  const [CreateChatbot, { data, loading, error }] = useMutation(
    CREATE_CHATBOT,
    {
      variables: {
        clerk_user_id: user?.id,
        name,
      },
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return <p>Loading user...</p>;
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
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}
export default CreateChatbot;
