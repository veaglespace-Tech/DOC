'use client';

import React from 'react';
import AvailabilityScheduler from '@/components/doctor/AvailabilityScheduler';
import VacationBlocks from '@/components/doctor/VacationBlocks';
import BookingRules from '@/components/doctor/BookingRules';

export default function DoctorAvailabilityPage() {
  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Availability & Scheduling</h1>
        <p className="mt-2 text-gray-500">Manage your working hours, time off, and appointment booking rules.</p>
      </div>

      <div className="space-y-8">
        {/* Availability Scheduler */}
        <section>
          <AvailabilityScheduler />
        </section>

        {/* Booking Rules & Configuration */}
        <section>
          <BookingRules />
        </section>

        {/* Time off & Vacations */}
        <section>
          <VacationBlocks />
        </section>
      </div>
    </div>
  );
}
