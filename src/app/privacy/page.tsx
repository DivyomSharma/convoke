"use client";

import { Shell } from "@/components/Shell";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-16">
        <div className="mb-10 hairline-b pb-8">
          <div className="eyebrow mb-4">Last Updated: June 20, 2026</div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-g6">
          <p>
            At Convoke, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the Convoke website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">1. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our Website, including information by which you may be personally identified, such as name, postal address, e-mail address, or telephone number ("personal information").
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Information you provide by filling in forms on our Website.</li>
              <li>Records and copies of your correspondence (including email addresses), if you contact us.</li>
              <li>Your responses to surveys that we might ask you to complete for research purposes.</li>
              <li>Details of transactions you carry out through our Website.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">2. How We Use Your Information</h2>
            <p>
              We use information that we collect about you or that you provide to us, including any personal information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To present our Website and its contents to you.</li>
              <li>To provide you with information, products, or services that you request from us.</li>
              <li>To fulfill any other purpose for which you provide it.</li>
              <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us.</li>
              <li>To notify you about changes to our Website or any products or services we offer or provide though it.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">3. Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">4. Contact Information</h2>
            <p>
              To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:privacy@convoke.com" className="underline-link text-ink">privacy@convoke.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-16 hairline-t pt-8">
          <Link href="/" className="eyebrow underline-link text-ink">
            ← Back to Home
          </Link>
        </div>
      </div>
    </Shell>
  );
}
