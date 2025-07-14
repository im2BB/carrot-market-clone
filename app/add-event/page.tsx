import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/actions/admin";
import AddEventForm from "./AddEventForm";

export const dynamic = "force-dynamic";

export default async function AddEventPage() {
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/login");
  }

  return <AddEventForm />;
}
