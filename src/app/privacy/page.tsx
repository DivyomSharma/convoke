import { Shell } from "@/components/Shell";

export default function PrivacyPolicy() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-20">
        <h1 className="serif text-5xl mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-g5 leading-relaxed">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-6 text-g6 leading-relaxed">
            This is a placeholder for the Convoke Privacy Policy. We collect information to provide better services to all our users. We do not sell your personal data to third parties. For full details on how we handle your data, please contact support.
          </p>
        </div>
      </div>
    </Shell>
  );
}
