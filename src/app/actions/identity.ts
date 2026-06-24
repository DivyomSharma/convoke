"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type IdentityType = "personal" | "org" | "space";

export async function switchIdentity(type: IdentityType, id?: string) {
  const store = await cookies();
  
  if (type === "personal") {
    store.set("convoke_active_identity", JSON.stringify({ type: "personal" }), {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
    });
  } else {
    if (!id) throw new Error("ID required for org/space identity");
    store.set("convoke_active_identity", JSON.stringify({ type, id }), {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
}
