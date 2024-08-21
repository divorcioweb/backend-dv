import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConnectionService } from 'src/connection/connection.service';

@Injectable()
export class CleanupService {
  constructor(private readonly db: ConnectionService) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    await this.db.resetpassword.deleteMany({
      where: {
        created_at: {
          lt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutos atrás
        },
      },
    });
  }
}
