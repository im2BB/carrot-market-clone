import getSession from "./session";

export default async function loginUser(user: { id: number } | null) {
  const session = await getSession();
  session.id = user?.id;
  await session.save();
}
