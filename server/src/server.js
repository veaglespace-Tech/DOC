const app = require('./app');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Test Database connection
    await prisma.$connect();
    console.log('Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

module.exports = { prisma };
