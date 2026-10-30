'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation } from '@/store/api/authApi';
import { useSelector } from 'react-redux';

export default function AdminProfilePage() {
  const { data: meResponse, refetch, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const user = meResponse?.data || meResponse || {};

  const [profileForm, setProfileForm] = useState({
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (user.id) {
      setProfileForm({
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    try {
      await updateMe({
        email: profileForm.email,
        phone: profileForm.phone,
      }).unwrap();

      setProfileSuccess(true);
      refetch();
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err) {
      setProfileError(err?.data?.message || 'Failed to update admin profile credentials.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      setPassSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassSuccess(false), 3500);
    } catch (err) {
      setPassError(err?.data?.message || 'Current password incorrect or update failed.');
    }
  };

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="h-3.5 w-3.5 text-indigo-600" />
          Master Identity & Access Control
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Super Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Profile & Security</span>
        </h1>
        <p className="text-slate-500 font-medium text-base mt-1">
          Manage system administrator credentials, verified communications, and cryptographic passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Col: Contact Information */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleProfileSubmit} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Admin Account Details</h3>
                <p className="text-xs text-slate-500 font-medium">Platform notification and login identifier</p>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                Admin credentials updated successfully!
              </div>
            )}

            {profileError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Admin Emergency Phone
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 99999 88888"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Security Level</span>
                    <span className="text-slate-500">Super Administrator (All Access)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px] uppercase">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Right Col: Change Password */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handlePasswordSubmit} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Update Master Password</h3>
                <p className="text-xs text-slate-500 font-medium">Bcrypt hashed credential encryption</p>
              </div>
            </div>

            {passSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                Password changed successfully!
              </div>
            )}

            {passError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                {passError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

