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

  const { data } = await serverClient.query<
    GetChatbotsByUserData,
    GetChatbotsByUserDataVariables
  >({
    query: GET_CHATBOTS_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });

  const sortedChatbotsByUser: Chatbot[] = [...(data.chatbotsByUser ?? [])].sort(
    (a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  );

  return (
    <>
      <div className="flex-1 pb-20 p-10">
        <h1 className="text-xl lg:text-3xl font-semibold mb-5">
          Active Chatbots
        </h1>
        {sortedChatbotsByUser.length === 0 && (
          <div>
            <p>
              You have not created any chatbots yet, Click on the button below
              to create one.
            </p>

            <Link href="/create-chatbot">
              <Button className="bg-[#6485F5] text-white p-3 rounded-md mt-5">
                Create Chatbot
              </Button>
            </Link>
          </div>
        )}

        <ul>
          {sortedChatbotsByUser.map((chatbot) => {
            return (
              <Link key={chatbot.id} href={`edit-chatbot/${chatbot.id}`}>
                <li>
                  <div>
                    <div className="flex items-center space-x-4 m-8">
                      <Avatar seed={chatbot.name} />
                      <h2 className="text-xl font-bold"> {chatbot.name}</h2>
                    </div>

                    <p className="absolute top-5 right-5 text-xs text-gray-400">
                      Created: {new Date(chatbot.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
}
export default ViewChatbots;
