import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { AlmacenModule } from './almacen/almacen.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      connection: { host: process.env.REDIS_HOST || 'localhost', port: 6379 },
    }),
    AlmacenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
