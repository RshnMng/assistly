import { ChatbotCharacteristic } from "@/types/types";
import { OctagonX } from "lucide-react";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  return (
    <li>
      {characteristic.content}
      <OctagonX className="w-6 h-6 text-whitr fill-red=500 absolute top-1 right-1 cursor-pointer hover:opacity-50" />
    </li>
  );
}
export default Characteristic;
