import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { serverClient } from "@/lib/server/server-client";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AI_KEY,
});

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  console.log(
    `revieved message from chat session ${chat_session_id} : ${content} (chatbot: ${chatbot_id})`
  );

  try {
    const { data } = await serverClient.query({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const { data: messageData } = await serverClient.query({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id },
      fetchPolicy: "no-cache",
    });

    const previousMessages = messageData.chat_sessions.messages;

    const formattedPreviousMessages = previousMessages.map((message) => {
      return {
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : "user",
        content: message.content,
      };
    });

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    const messages = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in teh same scope or domain as the points mentioned in the key information section, kindly inform the user that they can only to search for the specified content. Use emojis where possible and where relevant. Keep your responses between 1-2 sentences. Here is some key infomration that you need to be aware of... these are elements you may be asked about ${systemPrompt}`,
      },
      ...formattedPreviousMessages,

      {
        role: "user",
        name: "user",
        content: content,
      },
    ];

    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    console.log(aiResponse, "response ");

    if (!aiResponse) {
      return NextResponse.json({
        error: "failed to generate AI response",
        status: 500,
      });
    }

    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content,
        sender: "user",
        created_at: new Date().toISOString(),
      },
    });

    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: aiResponse,
        sender: "ai",
        created_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
    console.log(error, "error sending message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
