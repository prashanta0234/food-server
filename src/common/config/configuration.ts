export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST || 'food-redis',
    ttl: 3 * 60000,
  },
});
