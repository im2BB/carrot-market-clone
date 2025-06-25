import db from "@/lib/db";

export async function getStreamById(id: number) {
  return db.liveStream.findUnique({
    where: { id },
  });
}
