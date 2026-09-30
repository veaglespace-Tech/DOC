const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = ['PATIENT', 'DOCTOR', 'SUPERADMIN', 'ADMIN'];
  
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
    console.log(`Role ${role} created or already exists.`);
  }

  // Create superadmin user
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('superadmin123', 10);
  
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });
  
  const existingSa = await prisma.user.findFirst({
    where: { email: 'superadmin@careconnect.health' }
  });

  if (!existingSa) {
    await prisma.user.create({
      data: {
        email: 'superadmin@careconnect.health',
        passwordHash: hash,
        isActive: true,
        isVerified: true,
        userRoles: {
          create: {
            roleId: superAdminRole.id
          }
        }
      }
    });
    console.log('Superadmin created: superadmin@careconnect.health / superadmin123');
  } else {
    console.log('Superadmin already exists.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
