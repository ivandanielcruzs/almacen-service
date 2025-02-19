import { Module } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { RepositoriesModule } from 'src/infra/database/adapters/repositories.module';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    RepositoriesModule,
    BullModule.registerQueue({
      name: 'supply-request',
    }),
    BullModule.registerQueue({
      name: 'supply-confirmation',
    }),
    HttpModule,
  ],
  providers: [AlmacenService],
  exports: [AlmacenService],
})
export class AlmacenModule {}
