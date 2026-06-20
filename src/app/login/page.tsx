import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT: Photography Section */}
      <div className="hidden lg:flex flex-1 relative bg-muted items-end p-12 overflow-hidden">
        {/* Placeholder for realistic photography. In a real app, use an optimized Image component */}
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
          {/* A subtle image could be placed here with object-cover */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 text-white mix-blend-difference">
          <blockquote className="space-y-2">
            <p className="text-3xl font-serif leading-tight">
              &ldquo;The best way to predict the future is to invent it together.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* RIGHT: Auth Card Section */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <span className="font-serif text-4xl tracking-tight mb-2">Convoke.</span>
            <p className="text-sm text-muted-foreground">
              Build your future together.
            </p>
          </div>

          <div className="space-y-4">
            {/* OAuth Buttons */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full rounded-full h-12 shadow-sm font-medium">
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full rounded-full h-12 shadow-sm font-medium">
                Continue with Apple
              </Button>
              <Button variant="outline" className="w-full rounded-full h-12 shadow-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] hover:text-white border-transparent">
                Continue with Discord
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form Placeholder */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button className="w-full rounded-full h-12">
                Continue
              </Button>
            </form>
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
