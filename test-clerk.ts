import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();
  console.log(authObj.userId);
});
