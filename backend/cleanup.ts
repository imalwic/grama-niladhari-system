import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const sabhas = await prisma.pradeshiyaSabha.findMany();
  console.log("Found Sabhas:", sabhas);

  if (sabhas.length > 1) {
    // Keep the one with id 'default-ps-id' if it exists, or the first one
    const toKeep = sabhas.find(s => s.id === 'default-ps-id') || sabhas[0];
    const toDelete = sabhas.filter(s => s.id !== toKeep.id);

    for (const sabha of toDelete) {
      console.log(`Deleting duplicate sabha: ${sabha.id}`);
      // Reassign users to 'toKeep'
      await prisma.user.updateMany({
        where: { pradeshiyaSabhaId: sabha.id },
        data: { pradeshiyaSabhaId: toKeep.id }
      });
      // Reassign wasamas to 'toKeep'
      await prisma.wasama.updateMany({
        where: { pradeshiyaSabhaId: sabha.id },
        data: { pradeshiyaSabhaId: toKeep.id }
      });
      await prisma.pradeshiyaSabha.delete({ where: { id: sabha.id } });
    }

    // Rename the kept one to 'Weeraketiya'
    await prisma.pradeshiyaSabha.update({
      where: { id: toKeep.id },
      data: { name: 'Weeraketiya' }
    });
    console.log("Renamed to Weeraketiya");
  } else if (sabhas.length === 1) {
    await prisma.pradeshiyaSabha.update({
      where: { id: sabhas[0].id },
      data: { name: 'Weeraketiya' }
    });
    console.log("Renamed to Weeraketiya");
  }
}

main().finally(() => prisma.$disconnect());
