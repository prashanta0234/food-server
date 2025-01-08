import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly config: ConfigService,
  ) {}

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value as T, ttl);
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.cache.get(key);
    return value as T;
  }

  async remove(key: string) {
    await this.cache.del(key);
  }
}
