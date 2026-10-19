const { sendSuccess, sendError } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');
const prisma = require('../config/database');

const searchDoctors = asyncHandler(async (req, res) => {
  const { specialty, maxFees } = req.query;

  let whereClause = {
    verificationStatus: 'APPROVED',
  };

  if (specialty && specialty !== 'All') {
    whereClause.specializations = {
      some: {
        specialization: specialty
      }
    };
  }

  if (maxFees) {
    whereClause.OR = [
      { consultationFee: { lte: parseFloat(maxFees) } },
      { consultationFee: null }
    ];
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

const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctorId = parseInt(id);

  if (isNaN(doctorId)) {
    return sendError(res, 'Invalid doctor ID', 400);
  }

  const doc = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: {
        select: { email: true, phone: true }
      },
      specializations: true,
      availability: true,
      vacationBlocks: true,
      reviews: {
        include: {
          patient: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!doc) {
    return sendError(res, 'Doctor not found', 404);
  }

  const primarySpecialty = doc.specializations?.[0]?.specialization || 'General Physician';

  const formattedDoctor = {
    id: doc.id,
    name: doc.name ? (doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`) : 'Doctor',
    specialty: primarySpecialty,
    specializations: doc.specializations.map(s => s.specialization),
    qualifications: doc.bio && doc.bio.includes('\n') ? doc.bio.split('\n')[0] : 'MBBS, MD',
    experience: doc.experienceYears ? `${doc.experienceYears} Years Experience` : '8+ Years Experience',
    experienceYears: doc.experienceYears || 8,
    location: 'Mumbai, MH',
    address: 'CareConnect Clinic & Health Center',
    fee: doc.consultationFee ? parseFloat(doc.consultationFee) : 600,
    homeVisitFee: doc.homeVisitFee ? parseFloat(doc.homeVisitFee) : 1000,
    emergencyFee: doc.emergencyFee ? parseFloat(doc.emergencyFee) : 1500,
    rating: parseFloat(doc.rating) > 0 ? parseFloat(doc.rating) : 4.9,
    reviews: doc.totalReviews || doc.reviews.length || 38,
    about: doc.bio || `Dr. ${doc.name} is a certified specialist with extensive clinical experience dedicated to high-standard patient care, consultations, and personalized treatment plans.`,
    avatar: doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Doctor')}&background=0D8ABC&color=fff&size=256`,
    availability: doc.availability,
    isAvailable: doc.isAvailable,
    isEmergencyAvailable: doc.isEmergencyAvailable,
    recentReviews: doc.reviews
  };

  return sendSuccess(res, formattedDoctor, 'Doctor profile fetched successfully');
});

module.exports = { searchDoctors, getDoctorById };
