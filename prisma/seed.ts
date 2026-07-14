import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const authors = [
    { name: "Maya Chen", email: "maya@inkwell.dev" },
    { name: "Liam O'Brien", email: "liam@inkwell.dev" },
    { name: "Priya Sharma", email: "priya@inkwell.dev" },
  ];

  for (const author of authors) {
    await prisma.author.upsert({
      where: { email: author.email },
      update: {},
      create: author,
    });
  }

  console.log("Seeded 3 authors: Maya, Liam, Priya");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
