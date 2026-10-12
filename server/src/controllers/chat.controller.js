const prisma = require('../config/database');
const { getIO } = require('../config/socket');

/**
 * Get or create conversation for an appointment, returning message history
 */
exports.getConversation = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appId = parseInt(appointmentId);

    // Verify appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appId },
      include: {
        patient: { select: { id: true, name: true, userId: true } },
        doctor: { select: { id: true, name: true, userId: true } }
      }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify requesting user is either the doctor or the patient
    const isParticipant =
      req.user.id === appointment.patient.userId ||
      req.user.id === appointment.doctor.userId;

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'You are not a participant in this conversation' });
    }

    let conversation = await prisma.conversation.findUnique({
      where: { appointmentId: appId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { appointmentId: appId },
        include: { messages: true }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        conversation,
        patient: appointment.patient,
        doctor: appointment.doctor
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message in an appointment conversation
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { content, type = 'TEXT', fileUrl } = req.body;
    const appId = parseInt(appointmentId);

    if (!content && !fileUrl) {
      return res.status(400).json({ success: false, message: 'Message content or file required' });
    }

    // Ensure conversation exists
    let conversation = await prisma.conversation.findUnique({
      where: { appointmentId: appId }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { appointmentId: appId }
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user.id,
        type,
        content: content || '',
        fileUrl: fileUrl || null
      }
    });

    // Broadcast in real-time via Socket.IO
    try {
      const io = getIO();
      io.to(`appointment:${appId}`).emit('chat:message:new', {
        appointmentId: appId,
        message: {
          ...message,
          senderName: req.user.name || 'User'
        }
      });
    } catch (sockErr) {}

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};
