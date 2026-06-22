import { useState } from "react";

export function useShare() {
  const [copied, setCopied] = useState(false);

  const share = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // user cancelled or share failed, fallback to copy
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { share, copied, copyToClipboard };
}
