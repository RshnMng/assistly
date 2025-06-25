import client from "@/graphql/ApolloClient";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { INSERT_GUESTS } from "@/graphql/mutations/mutations";
import { INSERT_CHAT_SESSION } from "@/graphql/mutations/mutations";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  console.log("start new chat has ran");
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUESTS,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date().toISOString(),
      },
    });

    const guestId = guestResult.data.insertGuests.id;

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: new Date().toISOString(),
      },
    });

    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Welcome ${guestName}! \n How can I assist you today?`,
        created_at: new Date().toISOString(),
      },
    });

    return chatSessionId;
  } catch (error) {
    console.log(error, "error starting new chat session");
  }
}
export default startNewChat;
