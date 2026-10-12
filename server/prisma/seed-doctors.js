const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function main() {
  const hash = await bcrypt.hash('doctor123', 10);
  const docRole = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });

  for(let i=1; i<=4; i++) {
    const email = `doc${i}@careconnect.health`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        uuid: uuidv4(),
        email,
        passwordHash: hash,
        isActive: true,
        isVerified: true,
        userRoles: { create: { roleId: docRole.id } }
      }
    });

    const specialties = ['Cardiologist', 'Dermatologist', 'General Physician', 'Pediatrician'];

    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {
        verificationStatus: 'APPROVED',
        isAvailable: true,
        isEmergencyAvailable: true,
        consultationFee: 500 * i,
        experienceYears: 5 * i,
        rating: 4.5,
        totalReviews: 10 * i,
      },
      create: {
        userId: user.id,
        name: `Dr. Mock Doctor ${i}`,
        verificationStatus: 'APPROVED',
        isAvailable: true,
        isEmergencyAvailable: true,
        consultationFee: 500 * i,
        experienceYears: 5 * i,
        rating: 4.5,
        totalReviews: 10 * i,
        specializations: {
          create: { specialization: specialties[i-1] }
        }
      }
    });
    console.log('Seeded doctor:', email);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
