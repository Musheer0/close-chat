import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

type ExtendedPrisma = ReturnType<typeof prismaClientSingleton>;
declare global {
  var prismaGlobal: ExtendedPrisma | undefined;
}
const prismaClientSingleton = () =>
  new PrismaClient().$extends(withAccelerate());



const prisma: ExtendedPrisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;