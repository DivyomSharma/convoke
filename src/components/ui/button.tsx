import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      variant: "primary",
    },
    variants: {
      variant: {
        primary:
          "bg-foreground text-background shadow-[0_0_36px_rgba(198,161,111,0.18)] hover:bg-bronze hover:text-black",
        secondary:
          "border border-line bg-white/[0.035] text-foreground hover:border-bronze/60 hover:bg-white/[0.08]",
        ghost: "text-muted hover:bg-white/[0.06] hover:text-foreground",
        rust: "bg-rust text-white hover:bg-[#cf7542]",
      },
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}
