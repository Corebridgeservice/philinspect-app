'use client';

import { useState, useEffect } from 'react';

interface StatusData {
  googleMaps: string;
  googleSheets: string;
  zohoCRM: string;
  zohoBooks: string;
  zohoBooksFlagEnabled: boolean;
  environment: string;
  timestamp: string;
}

function StatusBadge({ status }: { status: string }) {
  const isConnected = status === 'connected';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isConnected
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      {isConnected ? 'Connected' : 'Not Configured'}
    </span>
  );
}

export default function InternalSettingsPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/internal/status?password=${encodeURIComponent(password)}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setAuthenticated(true);
      } else {
        setError('Incorrect password. Access denied.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/internal/status?password=${encodeURIComponent(password)}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch {
      setError('Failed to refresh status.');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">PHILinspect Internal</h1>
            <p className="text-xs text-gray-500 mt-1">Restricted access — team only</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Enter internal password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PHILinspect Internal</h1>
            <p className="text-xs text-gray-500">Integration Status Dashboard</p>
          </div>
          <button
            type="button"
            onClick={refreshStatus}
            disabled={loading}
            className="text-xs text-gray-900 hover:text-gray-900 font-medium"
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        {status && (
          <div className="flex flex-col gap-3">
            {/* Integration status */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Integration Status</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Google Maps API', key: 'googleMaps' },
                  { label: 'Google Sheets', key: 'googleSheets' },
                  { label: 'Zoho CRM', key: 'zohoCRM' },
                  { label: 'Zoho Books', key: 'zohoBooks' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <StatusBadge status={status[key as keyof StatusData] as string} />
                  </div>
                ))}
              </div>
            </div>

            {/* System info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">System Info</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Environment</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">{status.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Zoho Books Flag</span>
                  <span className={`text-xs font-medium ${status.zohoBooksFlagEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                    {status.zohoBooksFlagEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Last Checked</span>
                  <span className="text-xs font-medium text-gray-700">
                    {new Date(status.timestamp).toLocaleString('en-PH')}
                  </span>
                </div>
              </div>
            </div>

            {/* Security notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">
                🔒 This page shows connection status only. API keys, secrets, and tokens are never displayed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
