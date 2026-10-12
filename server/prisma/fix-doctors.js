const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.deleteMany({
    where: { email: { startsWith: 'doc' } }
  });
  console.log('Deleted mock doctors:', result);

  // Now approve real doctors
  const realDocs = await prisma.doctor.updateMany({
    where: { verificationStatus: 'PENDING' },
    data: { 
      verificationStatus: 'APPROVED',
      isAvailable: true,
      consultationFee: 500
    }
  });
  console.log('Approved real doctors:', realDocs);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
