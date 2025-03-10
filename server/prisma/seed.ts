import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = "sanau@gmail.com";
  const password = "123456";
  const name = "Sanaullah";
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
  });
  if (existingSuperAdmin) {
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const SuperAdminUser = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
      name,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Super Admin Created: ${SuperAdminUser.email}`);
}

main()
  .catch((e) => {
      console.error(e);
      process.exit(0)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
