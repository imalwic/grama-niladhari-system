import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WasamasModule } from './wasamas/wasamas.module';
import { HouseholdsModule } from './households/households.module';
import { ResidentsModule } from './residents/residents.module';
import { NoticesModule } from './notices/notices.module';
import { RequestsModule } from './requests/requests.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    WasamasModule,
    HouseholdsModule,
    ResidentsModule,
    NoticesModule,
    RequestsModule,
    CategoriesModule,
    NotificationsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
