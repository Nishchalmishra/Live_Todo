import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redis.on('connect', () => {
    console.log('🟢 Redis connected (ioredis)');
});

redis.on('error', (err) => {
    console.error('🔴 Redis error', err);
});

export default redis;
