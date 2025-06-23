"use client";
import { useMutation } from "@apollo/client";
import { REMOVE_CHARACTERISTIC } from "@/graphql/mutations/mutations";

import { ChatbotCharacteristic } from "@/types/types";
import { OctagonX } from "lucide-react";
import { toast } from "sonner";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleRemoveCharacteristic = async () => {
    try {
      return await removeCharacteristic({
        variables: {
          characteristicId: characteristic.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li
      key={characteristic.id}
      className="relative p-10 bg-white border rounded-md m-5"
    >
      {characteristic.content}
      <OctagonX
        className="w-6 h-6 stroke-black fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50 rotate-135"
        onClick={() => {
          const promise = handleRemoveCharacteristic();
          toast.promise(promise, {
            loading: "Removing...",
            success: "Characteristic removed",
            error: "Failed to remove characteristic",
          });
        }}
      />
    </li>
  );
}
export default Characteristic;
