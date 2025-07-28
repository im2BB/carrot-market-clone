import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
  role?: string;
}
export default async function getSession() {
  const password = process.env.COOKIE_PASSWORD;

  if (!password) {
    console.error("COOKIE_PASSWORD environment variable is not set");
    throw new Error("COOKIE_PASSWORD environment variable is required");
  }

  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "delicious-karrot",
    password: password,
  });
}
