'use client';
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Lock } from 'lucide-react';

export default function HIPAAPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
            <Lock className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">HIPAA Compliance</h1>
          <p className="text-lg text-slate-600">Your health data is protected by industry-leading security and compliance standards.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-600">
          <h2>Our Commitment to Security</h2>
          <p>
            The Health Insurance Portability and Accountability Act (HIPAA) sets the standard for sensitive patient data protection. Companies that deal with protected health information (PHI) must have physical, network, and process security measures in place and follow them to ensure HIPAA Compliance.
          </p>

          <h2>Encryption & Data Storage</h2>
          <p>
            ViolaCare uses AES-256 encryption at rest and TLS 1.3 for data in transit. All electronic health records (EHR), messaging between patients and doctors, and video consultations are fully encrypted end-to-end. Your data is stored on highly secure, compliant AWS servers located entirely within certified data centers.
          </p>

          <h2>Access Controls</h2>
          <p>
            We enforce strict Role-Based Access Control (RBAC). Only authorized medical professionals directly involved in your care can access your medical records. We log every access attempt, enabling comprehensive audit trails that ensure accountability.
          </p>

          <h2>Business Associate Agreements (BAA)</h2>
          <p>
            ViolaCare signs Business Associate Agreements with all enterprise clinic partners and third-party infrastructure providers. This ensures that every node in our data processing chain adheres to the same rigorous HIPAA standards.
          </p>

          <h2>Continuous Auditing</h2>
          <p>
            Our systems undergo continuous monitoring and annual third-party security audits to identify and patch vulnerabilities before they can be exploited, keeping us ahead of emerging security threats.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
