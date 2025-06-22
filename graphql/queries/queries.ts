import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
    }
    chatbot_characteristics(id: $id) {
      id
      content
      created_at
    }
    chat_sessions(id: $id) {
      id
      created_at
      messages {
        id
        content
        created_at
      }
    }
  }
`;
