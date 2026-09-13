import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const globalAdminEmail = 'system@gov.lk';
  const psAdminEmail = 'admin@gov.lk';
  const rawPassword = 'adminPassword!123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Create or ensure Pradeshiya Sabha exists
  let ps = await prisma.pradeshiyaSabha.findFirst({
    where: { name: 'Weeraketiya' },
  });

  if (!ps) {
    ps = await prisma.pradeshiyaSabha.create({
      data: {
        name: 'Weeraketiya',
        district: 'Hambantota',
      },
    });
  }

  // 2. Global Admin (SYSTEM_ADMIN -> SUPER_ADMIN)
  const globalAdmin = await prisma.user.upsert({
    where: { email: globalAdminEmail },
    update: {
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    create: {
      nic: '000000000X',
      name: 'Global System Admin',
      email: globalAdminEmail,
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // 3. PS Admin (PS_ADMIN for Weeraketiya)
  const psAdmin = await prisma.user.upsert({
    where: { email: psAdminEmail },
    update: {
      passwordHash: hashedPassword,
      role: 'PS_ADMIN',
      pradeshiyaSabhaId: ps.id,
    },
    create: {
      nic: '000000000V',
      name: 'Weeraketiya PS Admin',
      email: psAdminEmail,
      passwordHash: hashedPassword,
      role: 'PS_ADMIN',
      pradeshiyaSabhaId: ps.id,
    },
  });

  console.log(`[SEED] Admins created/updated:`);
  console.log(`       Global Admin: ${globalAdmin.email}`);
  console.log(`       PS Admin:     ${psAdmin.email}`);
  console.log(`       Password:     ${rawPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
