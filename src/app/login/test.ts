import { useSignIn } from '@clerk/nextjs';

export function Test() {
  const { signIn } = useSignIn();
  type Methods = keyof typeof signIn;
  const x: Methods = "authenticateWithRedirect";
}
