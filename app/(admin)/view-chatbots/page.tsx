import Avatar from "../components/Avatar";
import { Button } from "@/components/ui/button";
import { serverClient } from "@/lib/server/server-client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { GetChatbotsByUserData } from "@/types/types";
import { GetChatbotsByUserDataVariables } from "@/types/types";
import { Chatbot } from "@/types/types";
import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const response = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_CHATBOTS_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  console.log("GraphQL response :", response);

  //   const sortedChatbotsByUser: Chatbot[] = [...(data.chatbotsByUser ?? [])].sort(
  //     (a, b) => {
  //       return (
  //         new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //       );
  //     }
  //   );

  return (
    <>
      <div className="flex-1 pb-20 p-10">
        <h1 className="text-xl lg:text-3xl font-semibold mb-5">
          Active Chatbots
        </h1>
      </div>
    </>
  );
}
export default ViewChatbots;
