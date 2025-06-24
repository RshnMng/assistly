import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <main className="p-10 bg-white m-10 rouded-md w-full">
        <h1 className="text-4xl font-light">
          Welcome to{" "}
          <span className="text-[#6485f5] font-semibold">Assistly</span>
        </h1>
        <h2 className="mt-2 mb-10">
          {" "}
          Your customizable AI chat agent that can help you manage your customer
          conversations
        </h2>

        <Link href="/create-chatbot">
          <Button className="bg-[#6485F5]">
            Let's get started by creating your first chatbot
          </Button>
        </Link>
      </main>
    </>
  );
}
