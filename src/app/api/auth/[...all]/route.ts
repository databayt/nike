import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { SHOWCASE } from "@/lib/showcase";

const off = () => new Response("Accounts are disabled on this showcase.", { status: 404 });

export async function GET(req: NextRequest) {
  if (SHOWCASE) return off();
  const { auth } = await import("@/lib/auth");
  const { GET } = toNextJsHandler(auth);
  return GET(req);
}

export async function POST(req: NextRequest) {
  if (SHOWCASE) return off();
  const { auth } = await import("@/lib/auth");
  const { POST } = toNextJsHandler(auth);
  return POST(req);
}
