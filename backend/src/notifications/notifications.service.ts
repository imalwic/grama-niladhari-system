import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, title: string, message: string, type: string = 'INFO') {
    // 1. Save in Database (In-App Notification)
    const notification = await this.prisma.appNotification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // 2. Trigger Mock Email Service
    await this.sendEmail(userId, title, message);

    // 3. Trigger Mock Push Notification Service (FCM)
    await this.sendPushNotification(userId, title, message);

    return notification;
  }

  async getNotifications(userId: string) {
    return this.prisma.appNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.appNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // --- MOCKED EXTERNAL SERVICES ---

  private async sendEmail(userId: string, subject: string, body: string) {
    // In a real scenario, you'd use Nodemailer + Sendgrid/Resend here.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      this.logger.log(`[EMAIL SENT] To: ${user.email} | Subject: ${subject} | Body: ${body}`);
    } else {
      this.logger.warn(`[EMAIL SKIPPED] User ${userId} has no email configured.`);
    }
  }

  private async sendPushNotification(userId: string, title: string, body: string) {
    // In a real scenario, you'd use firebase-admin SDK here.
    this.logger.log(`[FCM PUSH SENT] To User: ${userId} | Title: ${title} | Body: ${body}`);
  }
}
