'use client';
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200">
            <ShieldCheck className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-lg text-slate-600">Last updated: October 10, 2026. We take your privacy and medical data security seriously.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 prose prose-slate prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600">
          <h2>1. Introduction</h2>
          <p>
            Welcome to ViolaCare. This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of the ViolaCare platform.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We ask for and collect the following personal information about you when you use the ViolaCare Platform. This information is necessary for the adequate performance of the contract between you and us and to allow us to comply with our legal obligations.
          </p>
          <ul>
            <li><strong>Account Information:</strong> When you sign up for an account, we require certain information such as your first name, last name, and email address.</li>
            <li><strong>Medical Records (EHR):</strong> Any health information you upload, or your healthcare provider uploads on your behalf, is strictly encrypted.</li>
            <li><strong>Identity Verification:</strong> To help create and maintain a trusted environment, we may collect identity verification information.</li>
          </ul>

          <h2>3. How We Use Information</h2>
          <p>
            We use, store, and process information, including personal information, about you to provide, understand, improve, and develop the ViolaCare Platform, create and maintain a trusted and safer environment, and comply with our legal obligations.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We are continuously implementing and updating administrative, technical, and physical security measures to help protect your information against unauthorized access, loss, destruction, or alteration. Some of the safeguards we use to protect your information are firewalls and data encryption, and information access controls.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You may exercise any of the rights described in this section before your applicable ViolaCare Data Controller by sending an email to privacy@violacare.com. Please note that we may ask you to verify your identity before taking further action on your request.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
