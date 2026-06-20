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
          <button className="bg-ink text-paper px-4 py-2 text-[13px]">+ Source from space</button>
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
