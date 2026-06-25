import { Metadata } from "next";
import JoinClient from "./JoinClient";

export const metadata: Metadata = {
  title: "Convoke | Communities",
  description: "Convoke makes community building effortless. One platform where communities organize, collaborate, fund, publish, hire and grow.",
};

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-transparent selection:bg-ink selection:text-paper">
      <JoinClient />
    </main>
  );
}
