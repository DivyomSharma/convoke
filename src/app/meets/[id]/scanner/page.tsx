import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkInAttendee } from "@/app/actions/workspace";
import { Shell } from "@/components/Shell";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";

export const revalidate = 0;

type ScannerUser = {
  avatarUrl: string | null;
  name: string | null;
  handle: string | null;
};

export default async function ScannerPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ u?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
  const userId = searchParams.u;

  const meet = await prisma.meet.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!meet) return notFound();

  let scanResult: { success: boolean; message: string; user?: ScannerUser } = {
    success: false,
    message: "No ticket scanned yet.",
  };

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        scanResult = { success: false, message: "Invalid ticket: User not found." };
      } else {
        await checkInAttendee(id, userId);
        scanResult = {
          success: true,
          message: "Check-in completed successfully.",
          user,
        };
      }
    } catch (error: unknown) {
      scanResult = {
        success: false,
        message: error instanceof Error ? error.message : "Failed to check in attendee.",
      };
    }
  }

  return (
    <Shell>
      <main className="mx-auto max-w-[480px] px-5 py-16 sm:px-8">
        <Link 
          href={`/meets/${id}`}
          className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-wider text-g5 hover:text-ink mb-8"
        >
          <ArrowLeft size={13} />
          <span>Back to Meet</span>
        </Link>

        <div className="border border-g3 rounded-sm p-8 bg-paper-card text-ink space-y-6 text-center">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-brand">
            Attendance Scanner
          </div>
          
          <h1 className="serif text-3xl font-light leading-tight">{meet.title}</h1>
          
          {userId ? (
            scanResult.success ? (
              <div className="space-y-6 pt-4 border-t border-g1">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h2 className="serif text-2xl text-green-500">Pass Validated</h2>
                  <p className="text-xs text-g5 mt-1">{scanResult.message}</p>
                </div>
                
                {scanResult.user && (
                  <div className="flex items-center justify-center gap-3 p-4 border border-g3/60 rounded-sm bg-g1">
                    <Avatar 
                      src={scanResult.user.avatarUrl || ""} 
                      name={scanResult.user.name || "Builder"} 
                      size={36} 
                    />
                    <div className="text-left">
                      <div className="font-medium text-[14px] text-ink">
                        {scanResult.user.name || "Anonymous"}
                      </div>
                      <div className="text-[11px] text-g5">
                        @{scanResult.user.handle || "builder"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t border-g1">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h2 className="serif text-2xl text-red-500">Validation Failed</h2>
                  <p className="text-xs text-g5 mt-1">{scanResult.message}</p>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-6 pt-4 border-t border-g1">
              <p className="text-[14px] leading-relaxed text-g5">
                Scan builder passport QR codes using your device camera, or enter their Builder ID below for manual check-in.
              </p>
              
              <form method="GET" className="space-y-3">
                <input 
                  type="text"
                  name="u"
                  required
                  placeholder="Enter Builder ID..."
                  className="w-full h-11 px-4 rounded-sm border border-g3 bg-transparent text-sm text-ink outline-none focus:border-brand/50 transition-all text-center font-mono"
                />
                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-full text-[13px] font-medium bg-ink text-paper dark:bg-white dark:text-black hover:opacity-85 transition-opacity cursor-pointer mono uppercase tracking-wider"
                >
                  Manual Validate
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}
