import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
  role?: string;
}
export default async function getSession() {
  const password = process.env.IRON_SECRET;
  
  if (!password) {
    console.error("IRON_SECRET environment variable is not set");
    throw new Error("IRON_SECRET environment variable is required");
  }
  
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "delicious-karrot",
    password: password,
  });
}
