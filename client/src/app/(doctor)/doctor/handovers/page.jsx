'use client';

import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  Send, 
  History,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { 
  useGetDoctorHandoversQuery, 
  useRequestHandoverMutation, 
  useRespondHandoverMutation,
  useGetDoctorDashboardQuery
} from '@/store/api/doctorApi';

export default function DoctorHandoversPage() {
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'request', 'outgoing'
  const { data: handoversResponse, isLoading, refetch } = useGetDoctorHandoversQuery();
  const { data: dashboardResponse } = useGetDoctorDashboardQuery();
  const [requestHandover, { isLoading: isRequesting }] = useRequestHandoverMutation();
  const [respondHandover, { isLoading: isResponding }] = useRespondHandoverMutation();

  // Handover Request Form State
  const [appointmentId, setAppointmentId] = useState('');
  const [reason, setReason] = useState('Schedule conflict');
  const [customReason, setCustomReason] = useState('');
  const [msg, setMsg] = useState(null);

  const incoming = handoversResponse?.data?.incoming || [];
  const outgoing = handoversResponse?.data?.outgoing || [];
  const upcomingAppointments = dashboardResponse?.data?.schedule || [];

  const handleRespond = async (handoverId, action) => {
    try {
      const res = await respondHandover({ id: handoverId, action }).unwrap();
      setMsg({ type: 'success', text: res.message || `Handover ${action.toLowerCase()}ed successfully!` });
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err?.data?.message || 'Error updating handover' });
    }
  };

  const handleCreateHandover = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!appointmentId) {
      setMsg({ type: 'error', text: 'Please select an appointment to handover' });
      return;
    }

    try {
      const finalReason = reason === 'Other' ? customReason : reason;
      const res = await requestHandover({
        appointmentId: parseInt(appointmentId),
        reason: finalReason
      }).unwrap();

      setMsg({ type: 'success', text: 'Handover requested! Notified available colleagues and patient.' });
      setAppointmentId('');
      setCustomReason('');
      refetch();
      setActiveTab('outgoing');
    } catch (err) {
      setMsg({ type: 'error', text: err?.data?.message || 'Failed to submit handover request' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black uppercase tracking-wider">
              BRD Section 9 Protocol
            </span>
            <span className="text-xs text-slate-400 font-bold">Historical Traceability Preserved</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Doctor Case Handover System</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Transfer patient visits seamlessly when emergencies or schedule conflicts arise.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'incoming' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Incoming Requests ({incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'request' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Initiate Handover
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'outgoing' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Outgoing Requests ({outgoing.length})
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />}
          {msg.text}
        </div>
      )}

      {/* TAB 1: INCOMING REQUESTS */}
      {activeTab === 'incoming' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Incoming Handover Requests</h3>
            <p className="text-xs text-slate-500">Colleagues requesting you to take over their scheduled appointment</p>
          </div>

          {incoming.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <ArrowRightLeft className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              No pending incoming handover requests at this time.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {incoming.map((item) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                        From Dr. {item.fromDoctor?.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Token: {item.appointment?.tokenNumber}</span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-900">
                      Patient: {item.appointment?.patient?.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> 
                        {new Date(item.appointment?.scheduledAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                        Type: {item.appointment?.serviceType}
                      </span>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-medium max-w-xl">
                      <span className="font-bold">Reason for Handover:</span> {item.reason}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRespond(item.id, 'REJECT')}
                      disabled={isResponding}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleRespond(item.id, 'ACCEPT')}
                      disabled={isResponding}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-colors"
                    >
                      Accept Assignment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INITIATE HANDOVER */}
      {activeTab === 'request' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900">Request Case Handover</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select one of your appointments and provide a reason to transfer it to an eligible colleague.
            </p>
          </div>

          <form onSubmit={handleCreateHandover} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Appointment</label>
              {upcomingAppointments.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  No upcoming appointments scheduled today. You can also enter an Appointment ID manually below:
                  <input
                    type="number"
                    placeholder="Enter Appointment ID (e.g. 1)"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-white rounded-lg border border-slate-200 font-mono text-sm"
                  />
                </div>
              ) : (
                <select
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Choose Appointment --</option>
                  {upcomingAppointments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.patientName} • {apt.time} ({apt.type})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Handover Reason (BRD Sec 9)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Personal emergency">Personal emergency</option>
                <option value="Doctor unavailable / unwell">Doctor unavailable / unwell</option>
                <option value="Outside service area">Outside service area</option>
                <option value="Other">Other (specify below)</option>
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specify Details</label>
                <input
                  type="text"
                  required
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Provide brief explanation for patient and colleague..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-slate-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" /> Platform Handover Rule
              </div>
              <p>Your original assignment record is permanently logged in system history.</p>
              <p>The patient will be immediately notified once another doctor accepts the handover.</p>
            </div>

            <button
              type="submit"
              disabled={isRequesting}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-lg shadow-teal-600/20 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isRequesting ? 'Initiating...' : 'Submit Handover Request'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: OUTGOING REQUESTS */}
      {activeTab === 'outgoing' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Your Handover History</h3>
            <p className="text-xs text-slate-500">Track all handovers initiated by you</p>
          </div>

          {outgoing.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <History className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              You have not initiated any handover requests yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Handover ID</th>
                    <th className="px-6 py-3">Appointment</th>
                    <th className="px-6 py-3">Transferred To</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {outgoing.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">HO-{item.id}</td>
                      <td className="px-6 py-4">
                        Token: {item.appointment?.tokenNumber || `#${item.appointment?.id}`}
                      </td>
                      <td className="px-6 py-4">
                        {item.toDoctor ? (
                          <span className="font-bold text-slate-800">Dr. {item.toDoctor.name}</span>
                        ) : (
                          <span className="text-slate-400 italic">Open Pool</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs max-w-xs truncate">{item.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' :
                          item.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
