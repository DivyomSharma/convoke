import { NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay } from "@/lib/razorpay";

const checkoutSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.literal("INR").default("INR"),
  receipt: z.string().min(3),
});

export async function POST(request: Request) {
  const input = checkoutSchema.parse(await request.json());
  const order = await getRazorpay().orders.create({
    amount: input.amount,
    currency: input.currency,
    receipt: input.receipt,
  });

  return NextResponse.json(order);
}
