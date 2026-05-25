"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "rust";
};

export function FormSubmitButton({
  children,
  pendingLabel = "Submitting...",
  className,
  variant,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={className} variant={variant} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
