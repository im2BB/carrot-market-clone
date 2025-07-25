import getSession from "./session";

export default async function loginUser(user: { id: number } | null) {
  try {
    console.log("loginUser: Starting login process for user ID:", user?.id);
    const session = await getSession();
    session.id = user?.id;
    await session.save();
    console.log("loginUser: Session saved successfully for user ID:", user?.id);
  } catch (error) {
    console.error("loginUser: Error during login:", error);
    throw error;
  }
}
