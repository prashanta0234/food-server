import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';

@Module({
  imports: [FoodsService],
  providers: [FoodsService],
  controllers: [FoodsController],
})
export class FoodsModule {}
