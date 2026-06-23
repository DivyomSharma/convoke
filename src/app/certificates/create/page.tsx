import { requireUser } from "@/lib/auth";
import { Shell } from "@/components/Shell";
import { UploadDropzone } from "@/lib/uploadthing";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function CreateCertificatePage() {
  const user = await requireUser();

  async function createCertificate(formData: FormData) {
    "use server";
    const dbUser = await requireUser();
    
    const title = formData.get("title") as string;
    const issuer = formData.get("issuer") as string;
    const issueDateStr = formData.get("issueDate") as string;
    const url = formData.get("url") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!title || !issuer || !issueDateStr) return;

    await prisma.certificate.create({
      data: {
        userId: dbUser.id,
        title,
        issuer,
        issueDate: new Date(issueDateStr),
        url: url || null,
        fileUrl: fileUrl || null,
      }
    });

    revalidatePath(`/profile`);
    revalidatePath(`/profile/${dbUser.handle || dbUser.username || dbUser.id}`);
    redirect(`/profile/${dbUser.handle || dbUser.username || dbUser.id}?tab=certificates`);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <div className="mb-10 text-center">
          <div className="eyebrow mb-2">Verified Credentials</div>
          <h1 className="serif text-5xl">Add Certificate</h1>
          <p className="mt-3 text-[14px] text-g5 max-w-[40ch] mx-auto leading-relaxed">
            Upload your professional certificates, meet credentials, or digital badges to display on your passport.
          </p>
        </div>

        <form action={createCertificate} className="space-y-6 premium-card p-6 sm:p-8">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Certificate Title *</label>
            <input 
              name="title" 
              required 
              className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
              placeholder="e.g. AWS Certified Developer" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Issuing Organization *</label>
              <input 
                name="issuer" 
                required 
                className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                placeholder="e.g. Amazon Web Services" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Issue Date *</label>
              <input 
                name="issueDate" 
                type="date"
                required 
                className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Credential URL (Optional)</label>
            <input 
              name="url" 
              type="url"
              className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
              placeholder="https://credly.com/..." 
            />
          </div>

          {/* Note: This is a simplistic placeholder for fileUrl. 
              In a real flow, you'd use a Client component wrapper around UploadDropzone 
              to set a hidden input value before form submission. For brevity we just accept a URL here. */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Direct File URL (Optional PDF/Image)</label>
            <input 
              name="fileUrl" 
              type="url"
              className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
              placeholder="https://..." 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
              Add to Profile
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
