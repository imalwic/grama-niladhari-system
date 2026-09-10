import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wasamas = await prisma.wasama.findMany({ take: 5 });
  console.log(wasamas);
  const count = await prisma.wasama.count();
  console.log(`Total Wasamas: ${count}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
