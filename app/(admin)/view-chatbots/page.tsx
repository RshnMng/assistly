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
      <div className="flex-1 pb-20 p-10 xl:bg-pink-400 lg:bg-blue-500 md:bg-green-500 sm:bg-red-700">
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

        <ul className="flex flex-col space-y-5">
          {sortedChatbotsByUser.map((chatbot) => {
            return (
              <Link key={chatbot.id} href={`edit-chatbot/${chatbot.id}`}>
                <li className="relative p-10 border rounded-md max-w-1xl bg-white m-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center  m-8">
                      <div className="flex items-center pb-1  flex-col">
                        <Avatar seed={chatbot.name} className="mr-3" />
                        <div className="flex flex-col text-center pr-2">
                          <p className="italic text-xs mt-1 ">
                            click logo to edit bot or
                          </p>
                          <p className="italic text-xs"> share link </p>
                        </div>
                      </div>
                      <div className="relative flex flex-col justify-start w-1/2 text-center flex-start min-w-32">
                        <h2 className="text-xl font-bold"> {chatbot.name}</h2>
                      </div>
                    </div>

                    <p className="absolute top-5 right-5 text-xs text-gray-400">
                      Created: {new Date(chatbot.created_at).toLocaleString()}
                    </p>
                  </div>

                  <hr className="mt-2" />

                  <div className="gird grid-cols-2 gap-10 md:gap-5 p-5">
                    <h3 className="italic text-center mb-5 text-lg font-mono">
                      Characteristics:{" "}
                    </h3>

                    <ul className="text-sm list-none">
                      {!chatbot.chatbot_characteristics.length && (
                        <p>No characteristics added yet.</p>
                      )}

                      {chatbot.chatbot_characteristics.map((characteristic) => {
                        return (
                          <li
                            className=" break-words border-4 border-blue-400 bg-blue-300 p-5 mb-2 text-base rounded-md max-w-2xl"
                            key={characteristic.id}
                          >
                            {characteristic.content}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="bg-blue-200 mt-4 text-center border border-blue-500 rounded-md max-w-2xl">
                      <h3 className="italic">No of Sessions:</h3>
                      <p>{chatbot.chat_sessions.length}</p>
                    </div>
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
