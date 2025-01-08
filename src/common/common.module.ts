import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CacheService } from './cache.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const ttl = configService.get<number>('CACHE_TTL', 3 * 60000);

        const store = await redisStore({
          socket: {
            host,
            port,
          },
          ttl,
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  providers: [PrismaService, CacheService],
  exports: [PrismaService, CacheService],
})
export class CommonModule {}
