'use client';
import React from 'react';
import { motion } from 'framer-motion';

const words = [
  "24/7 Emergency", "Top Specialists", "HD Video Consults", 
  "Home Nursing", "Lab Tests", "Pharmacy Delivery", 
  "Verified Doctors", "Secure Records"
];

export default function Marquee() {
  return (
    <div className="bg-teal-600 py-4 overflow-hidden border-y border-teal-500 flex whitespace-nowrap relative">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20
        }}
        className="flex shrink-0 items-center gap-12 px-6 text-white/90 font-bold uppercase tracking-widest text-sm"
      >
        {/* Duplicate the array 4 times to ensure seamless infinite scroll */}
        {[...words, ...words, ...words, ...words].map((word, idx) => (
          <span key={idx} className="flex items-center gap-12">
            <span>{word}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300/50"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
