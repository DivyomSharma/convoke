import { NotificationType } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getResend } from "@/lib/resend";

type NotifyInput = {
  userId: string;
  email?: string | null;
  type: NotificationType;
  title: string;
  message: string;
};

export async function createInAppNotification(input: NotifyInput) {
  const prisma = getPrisma();
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
    },
  });
}

export async function sendEmailNotification(input: NotifyInput) {
  if (!input.email) return { sent: false as const };

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Convoke <updates@convoke.app>",
      to: input.email,
      subject: input.title,
      text: input.message,
    });
    return { sent: true as const };
  } catch {
    return { sent: false as const };
  }
}

export async function notifyUser(input: NotifyInput) {
  await createInAppNotification(input);
  await sendEmailNotification(input);
}
