/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
export const setCache = async (
  key: string,
  data: any,
  ttl: number = 12 * 60 * 60 
) => {
  if (typeof data === 'object') {
    await redis.set(key, JSON.stringify(data), { ex: ttl });
  } else {
    await redis.set(key, data, { ex: ttl });
  }
};

export const deleteCache = async(key:string)=>{
    await redis.del(key)
}
export const getCache = async <T>(key: string): Promise<T | null> => {
  const data :string | null= await redis.get(key); 
  if (!data) return null;     

  try {
    return JSON.parse(data) as T;   
  } catch {
    return data as unknown as T;     
  }
};
