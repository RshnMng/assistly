import { serverClient } from "@/lib/server/server-client";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphql/queries/queries";
import { GetChatSessionMessagesVariables } from "@/types/types";
import { GetChatSessionMessagesResponse } from "@/types/types";
import Messages from "../../components/Messages";

export const dynamic = "force-dynamic";

async function reviewOneSession({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    data: {
      chat_sessions: {
        id: chatSessionId,
        created_at,
        messages,
        chatbots: { name },
        guests: { name: guestName, email },
      },
    },
  } = await serverClient.query<
    GetChatSessionMessagesResponse,
    GetChatSessionMessagesVariables
  >({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: { id: parseInt(id as string) },
  });

  console.log("sane check 1", messages);

  return (
    <div className="flex-1 p-10 pb-24">
      <h1 className="text-xl lg:text-3xl font-semibold">Session Review</h1>

      <p className="font-light text-xs text-purple-600 mt-2">
        Started at {new Date(created_at).toLocaleString()}{" "}
      </p>

      <h2 className="font-light mt-2">
        Between {name} & {guestName} ({email})
      </h2>

      <hr className="my-10" />

      <Messages
        messages={messages}
        chatSessionId={chatSessionId}
        chatbotName={name}
      />
    </div>
  );
}
export default reviewOneSession;
