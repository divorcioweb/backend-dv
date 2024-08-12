import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ConnectionService extends PrismaClient implements OnModuleInit {
  private _originalClient: any;

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _originalClient, ...rest } = this;
    return rest;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
