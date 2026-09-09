import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@gov.lk';
  const rawPassword = 'adminPassword!123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      nic: '000000000V',
      name: 'Super Admin',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`[SEED] Admin created/updated:`);
  console.log(`       Email:    ${admin.email}`);
  console.log(`       Password: ${rawPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
