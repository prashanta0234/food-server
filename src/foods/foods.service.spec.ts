import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
import { FoodEntity } from './entity/food.entity';
import { CacheService } from 'src/common/cache.service';
import { PrismaService } from 'src/common/prisma.service';

describe('FoodsService', () => {
  let service: FoodsService;
  let cacheServiceMock: jest.Mocked<CacheService>;
  let prismaServiceMock: {
    foods: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    cacheServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    prismaServiceMock = {
      foods: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodsService,
        { provide: CacheService, useValue: cacheServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetFoods service', () => {
    it('Should return cached foods if it is exists', async () => {
      const cachedFoods: FoodEntity[] = [
        {
          id: '1',
          name: 'Pizza',
          price: 350,
          image: 'pizza.jpg',
          quentity: 5,
          description: 'BBQ pizza with extra cheese.',
        },
      ];

      cacheServiceMock.get.mockResolvedValueOnce(cachedFoods);

      const result = await service.getFoods();

      expect(cacheServiceMock.get).toHaveBeenCalledWith('foods');
      expect(result).toEqual(cachedFoods);
      expect(prismaServiceMock.foods.findMany).not.toHaveBeenCalled();
      expect(cacheServiceMock.set).not.toHaveBeenCalled();
    });

    it('Should get foods from database and set in cache if its not in cache', async () => {
      const dbFoods: FoodEntity[] = [
        {
          id: '2',
          name: 'Burger',
          price: 250,
          image: 'burger.jpg',
          quentity: 10,
          description: 'Juicy Chiken burger',
        },
      ];

      cacheServiceMock.get.mockResolvedValueOnce(null);

      prismaServiceMock.foods.findMany.mockResolvedValueOnce(dbFoods);

      const result = await service.getFoods();

      expect(cacheServiceMock.get).toHaveBeenCalledWith('foods');
      expect(prismaServiceMock.foods.findMany).toHaveBeenCalled();
      expect(cacheServiceMock.set).toHaveBeenCalledWith('foods', dbFoods);
      expect(result).toEqual(dbFoods);
    });

    it('Should return empty array if there is no foods. And store empty array in cache.', async () => {
      const dbFoods: FoodEntity[] = [];
      const cachedFod: FoodEntity[] = [];

      cacheServiceMock.get.mockResolvedValueOnce(null);

      prismaServiceMock.foods.findMany.mockResolvedValueOnce(dbFoods);

      const result = await service.getFoods();

      expect(cacheServiceMock.get).toHaveBeenCalledWith('foods');
      expect(prismaServiceMock.foods.findMany).toHaveBeenCalled();
      expect(cacheServiceMock.set).toHaveBeenCalledWith('foods', dbFoods);
      expect(result).toEqual(dbFoods);
      expect(result).toEqual(cachedFod);
    });
  });
});
