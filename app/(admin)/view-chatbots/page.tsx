import Avatar from "../components/Avatar";
import { Button } from "@/components/ui/button";
import { serverClient } from "@/lib/server/server-client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { GET_CHATBOT_BY_USER } from "@/graphql/queries/queries";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  return <div>viewChatbots</div>;
}
export default ViewChatbots;
