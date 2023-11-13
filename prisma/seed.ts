import { PrismaClient } from '@prisma/client';

(async () => {
  const prisma = new PrismaClient();

  const data = [
    { name: 'Admin' },
    { name: 'User' },
    { name: 'Supervisor' }
  ];

  await prisma.role.createMany({ data })
    .catch(({ message }) => console.error(`Error: ${message}`))
    .finally(async () => await prisma.$disconnect());
})();