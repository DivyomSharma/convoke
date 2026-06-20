"use client";

import { Shell } from "@/components/Shell";
import Link from "next/link";

export default function TermsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-16">
        <div className="mb-10 hairline-b pb-8">
          <div className="eyebrow mb-4">Last Updated: June 20, 2026</div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Terms of Service</h1>
        </div>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-g6">
          <p>
            Welcome to Convoke. These terms and conditions outline the rules and regulations for the use of our website and services.
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Convoke if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">1. Terminology</h2>
            <p>
              The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">2. License</h2>
            <p>
              Unless otherwise stated, Convoke and/or its licensors own the intellectual property rights for all material on Convoke. All intellectual property rights are reserved. You may access this from Convoke for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Republish material from Convoke</li>
              <li>Sell, rent or sub-license material from Convoke</li>
              <li>Reproduce, duplicate or copy material from Convoke</li>
              <li>Redistribute content from Convoke</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">3. User Comments</h2>
            <p>
              Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Convoke does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Convoke, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
            </p>
            <p>
              To the extent permitted by applicable laws, Convoke shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="serif text-2xl text-ink">4. Disclaimer</h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Limit or exclude our or your liability for death or personal injury;</li>
              <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
              <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
              <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>
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
