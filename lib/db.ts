import { PrismaClient } from "./generated/prisma";

const db = new PrismaClient();

async function test() {
  const user = await db.user.create({
    data: {
      username: "qwer",
    },
  });
  console.log(user);
}

test();

export default db;
