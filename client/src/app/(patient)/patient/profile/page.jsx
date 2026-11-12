'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  X, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import VitalsCard from '@/components/patient/VitalsCard';
import AllergiesCard from '@/components/patient/AllergiesCard';
import MedicalRecordsCard from '@/components/patient/MedicalRecordsCard';
import VitalsTrendChart from '@/components/patient/VitalsTrendChart';
import FamilyMembersCard from '@/components/patient/FamilyMembersCard';
import { useGetPatientProfileQuery, useUpdatePatientProfileMutation } from '@/store/api/patientApi';

export default function PatientProfilePage() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { data: profileResponse, isLoading, refetch } = useGetPatientProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdatePatientProfileMutation();

  const profile = profileResponse?.data || {};
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'O+',
    address: '',
    city: '',
    emergencyContact: ''
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      name: profile.name || authUser?.name || '',
      gender: profile.gender ? profile.gender.toUpperCase() : 'MALE',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      bloodGroup: profile.bloodGroup || 'O+',
      address: profile.address || '',
      city: profile.city || '',
      emergencyContact: profile.emergencyContact || ''
    });
    setErrorMsg('');
    setSaveSuccess(false);
    setShowEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const payload = {
        name: formData.name?.trim(),
        gender: (formData.gender || 'MALE').toUpperCase(),
        bloodGroup: formData.bloodGroup || undefined,
        city: formData.city?.trim() || undefined,
        address: formData.address?.trim() || undefined,
      };
      if (formData.dateOfBirth) {
        payload.dateOfBirth = formData.dateOfBirth;
      }
      if (formData.emergencyContact?.trim()) {
        payload.emergencyContact = formData.emergencyContact.replace(/[\s-]/g, '');
      }

      await updateProfile(payload).unwrap();
      setSaveSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setSaveSuccess(false);
        refetch();
      }, 1000);
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.data?.errors?.[0]?.message || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  const patientName = profile.name || authUser?.name || 'Patient';
  const patientEmail = profile.user?.email || authUser?.email || 'email@example.com';
  const patientPhone = profile.user?.phone || authUser?.phone || '+91 98000 00000';
  const patientCity = profile.city || 'Mumbai, Maharashtra';
  const patientId = profile.id ? `PAT-${String(profile.id).padStart(6, '0')}` : 'PAT-PENDING';

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {/* Header Section */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="-mt-16 sm:-mt-20 relative z-20 flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl text-4xl font-black">
                {patientName.charAt(0).toUpperCase()}
              </div>
              <div className="pb-1 sm:pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{patientName}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                    Verified
                  </span>
                </div>
                <p className="font-semibold text-slate-400 text-xs sm:text-sm font-mono mt-0.5">Patient ID: {patientId}</p>
              </div>
            </div>
            
            <button 
              onClick={handleOpenEdit}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-xs font-bold shadow-md transition-all hover:-translate-y-0.5 shrink-0"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{patientEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{patientPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{patientCity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Longitudinal Vitals Trends (Full Width or 2-Col) */}
        <VitalsTrendChart />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Personal Vitals, Family & Allergies */}
          <div className="space-y-8 lg:col-span-1">
            <VitalsCard profile={profile} onEdit={handleOpenEdit} />
            <FamilyMembersCard familyMembers={profile.familyMembers || []} />
            <AllergiesCard />
          </div>

          {/* Right Column - Medical History / EHR */}
          <div className="lg:col-span-2">
            <MedicalRecordsCard />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Patient Profile</h3>
                  <p className="text-xs text-slate-400">Update personal health attributes & contact info</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {saveSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Profile Updated Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">Your healthcare profile has been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block uppercase text-[11px] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[11px] mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase text-[11px] mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[11px] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-[11px] mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Pune, Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-[11px] mb-1">Emergency Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 00000"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-[11px] mb-1">Address</label>
                  <textarea
                    rows={2}
                    placeholder="Full residential address..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
