'use client';
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
            <FileText className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Terms of Service</h1>
          <p className="text-lg text-slate-600">Last updated: October 10, 2026. Please read these terms carefully before using ViolaCare.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the ViolaCare platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            ViolaCare provides users with access to a rich collection of healthcare resources, including health management tools, doctor consultation platforms, appointment scheduling, and electronic health records (EHR) management. You understand and agree that the Service is provided "AS-IS" and that ViolaCare assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
          </p>

          <h2>3. Medical Disclaimer</h2>
          <p>
            <strong>The content on ViolaCare is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</strong> Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>

          <h2>4. User Conduct</h2>
          <p>
            You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from which such Content originated.
          </p>

          <h2>5. Modifications to Service</h2>
          <p>
            ViolaCare reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that ViolaCare shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
