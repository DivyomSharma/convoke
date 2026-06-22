import { Shell } from "@/components/Shell";
import { MessagesClient } from "./MessagesClient";

export const metadata = {
  title: "Messages | Convoke",
};

export default function Messages() {
  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <MessagesClient />
      </div>
    </Shell>
  );
}
