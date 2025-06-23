import { serverClient } from "@/lib/server/server-client";
import { auth } from "@clerk/nextjs/server";

import {
  Chatbot,
  GetUserChatbotResponse,
  GetUserChatbotsVariables,
} from "@/types/types";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";

async function ReviewSession() {
  const user = await auth();

  const userId = user.userId;

  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    GetUserChatbotResponse,
    GetUserChatbotsVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { userId: userId },
  });

  const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot) => {
    return {
      ...chatbot,
      chat_sessions: [
        ...chatbot.chat_sessions.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }),
      ],
    };
  });

  return (
    <div className="flex-1 px-10">
      <h1 className="text-xl lg:text-3xl fonto-semibold mt-10">
        Chat Sessions
      </h1>
      <h2 className="mb-5">
        Review all the chat sessions the chat bots have had with your customers
      </h2>
    </div>
  );
}
export default ReviewSession;
