import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
console.log(`Prisma client created`);
export default prisma;