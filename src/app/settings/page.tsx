import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/forms/SettingsForm";

export default async function Settings() {
  const user = await requireUser();
  const settings = await prisma.settings.findUnique({ where: { userId: user.id } });

  return (
    <Shell>
      <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6">
          <div className="eyebrow">Account</div>
          <h1 className="serif text-5xl mt-2">Settings.</h1>
        </div>
        <div className="mt-10">
          <SettingsForm user={user} settings={settings} />
        </div>
      </div>
    </Shell>
  );
}
