import db from "@/lib/db";

export async function getEvents() {
  return db.event.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getEventById(id: number) {
  return db.event.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
