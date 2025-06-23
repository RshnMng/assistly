import { serverClient } from "@/lib/server/server-client";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphql/queries/queries";
import { GetChatSessionMessagesVariables } from "@/types/types";
import { GetChatSessionMessagesResponse } from "@/types/types";

export const dynamic = "force-dynamic";

async function reviewOneSession({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await serverClient.query<
    GetChatSessionMessagesResponse,
    GetChatSessionMessagesVariables
  >({
    query: GET_CHAT_SESSION_MESSAGES,
    variables: { id: parseInt(id as string) },
  });

  console.log(data, "data check 1");
  return <div>reviewOneSession</div>;
}
export default reviewOneSession;
