import { Controller, Get } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodEntity } from './entity/food.entity';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  async getFoods(): Promise<FoodEntity[]> {
    return await this.foodsService.getFoods();
  }
}
