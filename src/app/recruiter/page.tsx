import { Shell } from "@/components/Shell";

export default function Recruiter() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        <div className="flex items-baseline justify-between hairline-b pb-6">
          <div>
            <div className="eyebrow">Recruiter Mode</div>
            <h1 className="serif text-4xl mt-2">Founding engineer</h1>
          </div>
          <button onClick={() => alert('Feature coming soon')} className="bg-ink text-paper px-4 py-2 text-[13px]">+ Source from space</button>
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-g1/30 border border-g3 rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-g2 flex items-center justify-center">🎁</div>
            <div>
              <div className="text-[13px] font-medium text-ink">Need intern welcome kits?</div>
              <div className="text-[12px] text-g5">Level up your onboarding with custom apparel and gear.</div>
            </div>
          </div>
          <a href="https://merch.theplotarmour.xyz" target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium px-4 py-1.5 border border-g3 rounded-full hover:bg-g2 transition-colors">
            Order Merch
          </a>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="hairline-b text-g5 mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-normal">Candidate</th>
                <th className="pb-3 font-normal">Score</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-g3">
              <tr>
                <td colSpan={4} className="py-20 text-center text-g5 eyebrow">No candidates in pipeline.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
