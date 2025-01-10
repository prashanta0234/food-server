import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/common/cache.service';
import { PrismaService } from 'src/common/prisma.service';
import { FoodEntity } from './entity/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async getFoods(): Promise<FoodEntity[]> {
    const cacheFoods = await this.cacheService.get<FoodEntity[]>('foods');
    if (cacheFoods) {
      return cacheFoods;
    }
    const foods = await this.prismaService.foods.findMany();
    await this.cacheService.set('foods', foods);
    return foods;
  }
}
