import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;
  let cacheMock: jest.Mocked<Cache>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    cacheMock = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<Cache>;

    configServiceMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useValue: cacheMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(cacheService).toBeDefined();
  });

  describe('set', () => {
    it('should call cache.set with the correct parameters', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 100;

      await cacheService.set(key, value, ttl);

      expect(cacheMock.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });

  describe('get', () => {
    it('should return the value from cache.get', async () => {
      const key = 'test-key';
      const cachedValue = { data: 'test-value' };

      cacheMock.get.mockResolvedValueOnce(cachedValue);

      const result = await cacheService.get<typeof cachedValue>(key);

      expect(cacheMock.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(cachedValue);
    });

    it('should return null if cache.get returns undefined', async () => {
      const key = 'missing-key';

      cacheMock.get.mockResolvedValueOnce(null);

      const result = await cacheService.get(key);

      expect(cacheMock.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should call cache.del with the correct key', async () => {
      const key = 'test-key';

      await cacheService.remove(key);

      expect(cacheMock.del).toHaveBeenCalledWith(key);
    });
  });
});
