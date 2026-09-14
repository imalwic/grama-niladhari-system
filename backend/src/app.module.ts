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
import { SupportModule } from './support/support.module';
import { AdminModule } from './admin/admin.module';
import { SystemAdminModule } from './system-admin/system-admin.module';
import { AuditModule } from './audit/audit.module';
import { GrievancesModule } from './grievances/grievances.module';
import { DocumentsModule } from './documents/documents.module';
import { SubsidiesModule } from './subsidies/subsidies.module';
import { EventsModule } from './events/events.module';

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
    SupportModule,
    AdminModule,
    SystemAdminModule,
    AuditModule,
    GrievancesModule,
    DocumentsModule,
    SubsidiesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
