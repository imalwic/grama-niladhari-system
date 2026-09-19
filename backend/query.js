const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const forms = await prisma.dynamicForm.findMany({
    include: { _count: { select: { fields: true } } },
    orderBy: { createdAt: 'desc' }
  });
  console.log(forms.map(f => ({id: f.id, title: f.title, status: f.status, fields: f._count.fields})));
}
run().finally(() => prisma.$disconnect());
