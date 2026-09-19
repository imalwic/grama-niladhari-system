const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/src/app.module');
const { PrismaService } = require('./dist/src/prisma/prisma.service');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  const forms = await prisma.dynamicForm.findMany({
    include: { _count: { select: { fields: true } } },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log("ALL FORMS IN DB:");
  forms.forEach(f => {
    console.log(`- ID: ${f.id}, Title: "${f.title}", Status: ${f.status}, Fields Count: ${f._count.fields}`);
  });
  
  await app.close();
}
bootstrap();
