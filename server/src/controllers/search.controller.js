const { sendSuccess, sendError } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');
const prisma = require('../config/database');

const searchDoctors = asyncHandler(async (req, res) => {
  const { specialty, maxFees } = req.query;

  let whereClause = {
    // We only want verified doctors
    // Assuming verificationStatus is stored on Doctor model, or we just return all for now if no status field
  };

  if (specialty && specialty !== 'All') {
    whereClause.specializations = {
      some: {
        specialization: specialty
      }
    };
  }

  if (maxFees) {
    whereClause.consultationFee = {
      lte: parseFloat(maxFees)
    };
  }

  const doctors = await prisma.doctor.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          email: true,
        }
      },
      specializations: true
    },
    take: 20
  });

  // Map to frontend-friendly format
  const formattedDoctors = doctors.map(doc => ({
    id: doc.id,
    name: doc.name || 'Unknown Doctor',
    specialty: doc.specializations?.[0]?.specialization || 'General Physician',
    experience: doc.experienceYears ? `${doc.experienceYears} Years` : 'New',
    distance: Math.floor(Math.random() * 10) + 1, // Mock distance for now since we don't have user loc
    fees: doc.consultationFee || 500,
    rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Mock rating
    reviews: Math.floor(Math.random() * 200) + 10,
    availability: doc.isAvailable ? 'Available Today' : 'Next Available: Tomorrow',
    isEmergencyAvailable: doc.isEmergencyAvailable || false,
    verificationStatus: doc.verificationStatus || 'Pending',
    image: doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Doctor')}&background=0D8ABC&color=fff`
  }));

  return sendSuccess(res, formattedDoctors, 'Doctors fetched successfully');
});

module.exports = { searchDoctors };
