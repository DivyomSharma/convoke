import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize — Convoke Dashboard",
  description: "A collaborative Convoke hub for event teams, volunteers, sponsors, merch plans, and community momentum.",
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
