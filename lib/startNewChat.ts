import client from "@/graphql/ApolloClient";
import { gql } from "@apollo/client";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { INSERT_GUESTS } from "@/graphql/mutations/mutations";
import { INSERT_CHAT_SESSION } from "@/graphql/mutations/mutations";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
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
    console.log(chatbotId, "chatbot id");

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: new Date().toISOString(),
      },
    });

    console.log(chatSessionResult, "chat-result");
  } catch (error) {
    console.log(error, "error starting new chat session");
  }
}
export default startNewChat;
