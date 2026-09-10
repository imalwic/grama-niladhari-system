import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const weeraketiyaWasamas = [
  { id: "381", name: "Bedigama South" },
  { id: "382", name: "Bedigama East" },
  { id: "383", name: "Bedigama North" },
  { id: "384", name: "Medagoda" },
  { id: "385", name: "Bedigama West" },
  { id: "386", name: "Kuda Bedigama" },
  { id: "387", name: "Weeraketiya East" },
  { id: "388", name: "Weeraketiya West" },
  { id: "389", name: "Mandaduwa" },
  { id: "390", name: "Agrahera" },
  { id: "391", name: "Buddiyagama East" },
  { id: "392", name: "Buddiyagama West" },
  { id: "394", name: "Mulgirigala South" },
  { id: "395", name: "Mulgirigala East" },
  { id: "436", name: "Raluwa" },
  { id: "397", name: "Udukiriwila" },
  { id: "398", name: "Yakgasmulla" },
  { id: "399", name: "Medamulana" },
  { id: "400", name: "Degampotha" },
  { id: "401", name: "Siyambalaheddawa" },
  { id: "417", name: "Kuda Bibula South" },
  { id: "402", name: "Kinchigune East" },
  { id: "403", name: "Kinchigune South" },
  { id: "404", name: "Kinchigune West" },
  { id: "441", name: "Meegasara" },
  { id: "442", name: "Medagama" },
  { id: "424", name: "Kandamadiththa" },
  { id: "405", name: "Kemegala" },
  { id: "406", name: "Morayaya South" },
  { id: "407", name: "Morayaya North" },
  { id: "408", name: "Wekandawala North" },
  { id: "409", name: "Wekandawala South" },
  { id: "410", name: "Debokkawa East" },
  { id: "411", name: "Debokkawa West" },
  { id: "412", name: "Thelambuyaya" },
  { id: "413", name: "Ihala Gonadeniya" },
  { id: "414", name: "Pahala Gonadeniya" },
  { id: "415", name: "Ambakolawewa North" },
  { id: "416", name: "Ambakolawewa South" },
  { id: "427", name: "Kaluwagahayaya" },
  { id: "418", name: "Kudabibula North" },
  { id: "419", name: "Galpoththayaya South" },
  { id: "420", name: "Galpoththayaya North" },
  { id: "421", name: "Heelage Aina" },
  { id: "422", name: "Handapangala Aina" },
  { id: "423", name: "Malhewage Aina" },
  { id: "425", name: "Mulanyaya" },
  { id: "426", name: "Kudagalara" },
  { id: "428", name: "Okandayaya North" },
  { id: "429", name: "Okandayaya West" },
  { id: "438", name: "Keppetiyawa South" },
  { id: "439", name: "Keppetiyawa North" },
  { id: "440", name: "Buddiyagama North" },
  { id: "393", name: "Mulgirigala West" },
  { id: "396", name: "Mulgirigala North" },
  { id: "443", name: "Iththademaliya South" },
  { id: "444", name: "Iththademaliya West" },
  { id: "445", name: "Iththademaliya East" },
  { id: "446", name: "Athubonde East" },
  { id: "447", name: "Athubonde West" }
];

async function main() {
  console.log('Seeding Database...');
  
  // Create Weeraketiya PS if not exists
  let weeraketiyaPS = await prisma.pradeshiyaSabha.findFirst({
    where: { name: 'Weeraketiya' }
  });

  if (!weeraketiyaPS) {
    weeraketiyaPS = await prisma.pradeshiyaSabha.create({
      data: {
        name: 'Weeraketiya',
        district: 'Hambantota'
      }
    });
    console.log('Created Weeraketiya Pradeshiya Sabha');
  }

  // Insert Wasamas
  for (const w of weeraketiyaWasamas) {
    const existing = await prisma.wasama.findUnique({
      where: { code: w.id }
    });

    if (!existing) {
      await prisma.wasama.create({
        data: {
          code: w.id,
          name: w.name,
          pradeshiyaSabhaId: weeraketiyaPS.id
        }
      });
      console.log(`Created Wasama: ${w.id} - ${w.name}`);
    }
  }

  console.log('Done seeding Weeraketiya Wasamas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
