import db from "@/lib/db";

export async function getEventById(id: number) {
  return db.event.findUnique({
    where: { id },
  });
}
