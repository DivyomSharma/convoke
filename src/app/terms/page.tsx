import { Shell } from "@/components/Shell";

export default function TermsOfService() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-20">
        <h1 className="serif text-5xl mb-8">Terms of Service</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-g5 leading-relaxed">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-6 text-g6 leading-relaxed">
            This is a placeholder for the Convoke Terms of Service. By using our platform, you agree to abide by our community guidelines and local laws. Convoke reserves the right to suspend accounts that violate these terms.
          </p>
        </div>
      </div>
    </Shell>
  );
}
