import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });


async function main() {
  const email = "admin@govlogix.in";
  const password = "admin123";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
    },
  });

  console.log("Admin user created: " + email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
