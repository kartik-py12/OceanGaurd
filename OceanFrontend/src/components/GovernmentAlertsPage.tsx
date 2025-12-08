import React, { useState, useEffect } from 'react';
import { Page, type User } from '../types';
import { api } from '../utils/api';

interface Alert {
  id: string;
  type: 'weather' | 'tsunami' | 'earthquake';
  source: 'NOAA' | 'USGS';
  title: string;
  severity: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  expiresAt?: string;
  url?: string;
  instruction?: string;
}

interface AlertSummary {
  total: number;
  weather: number;
  tsunami: number;
  earthquake: number;
}

interface GovernmentAlertsPageProps {
  onNavigate: (page: Page) => void;
  user: User | null;
}

export const GovernmentAlertsPage: React.FC<GovernmentAlertsPageProps> = ({ onNavigate, user }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary>({ total: 0, weather: 0, tsunami: 0, earthquake: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'weather' | 'tsunami' | 'earthquake'>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchAlerts();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.getGovernmentAlerts();
      setAlerts(response.data);
      setSummary(response.summary);
      setLastUpdated(response.lastUpdated);
    } catch (error) {
      console.error('Error fetching government alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'weather': return '🌪️';
      case 'tsunami': return '🌊';
      case 'earthquake': return '🌍';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes('extreme') || s >= '7') return 'bg-red-500/20 border-red-500 text-red-300';
    if (s.includes('severe') || s >= '6') return 'bg-orange-500/20 border-orange-500 text-orange-300';
    if (s.includes('moderate')) return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
    return 'bg-blue-500/20 border-blue-500 text-blue-300';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            <span className="text-xl font-bold text-white">OceanGuard</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate(Page.HOME)} className="text-slate-300 hover:text-white">Home</button>
            <button onClick={() => onNavigate(Page.MAP)} className="text-slate-300 hover:text-white">Map</button>
            <button onClick={() => onNavigate(Page.NEWS)} className="text-slate-300 hover:text-white">News</button>
            <button onClick={() => onNavigate(Page.ANALYTICS)} className="text-slate-300 hover:text-white">Analytics</button>
            {user && (
              <button onClick={() => onNavigate(Page.PROFILE)} className="text-slate-300 hover:text-white">Profile</button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚨 Government Alerts</h1>
          <p className="text-slate-400">Official warnings from NOAA and USGS</p>
          {lastUpdated && (
            <p className="text-xs text-slate-500 mt-2">
              Last updated: {new Date(lastUpdated).toLocaleString()}
              <button onClick={fetchAlerts} className="ml-3 text-blue-400 hover:text-blue-300">
                🔄 Refresh
              </button>
            </p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => setFilter('all')}
            className={`bg-slate-800/50 border-2 rounded-xl p-6 cursor-pointer transition ${
              filter === 'all' ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-white">{summary.total}</div>
            <div className="text-sm text-slate-400">Total Alerts</div>
          </div>

          <div 
            onClick={() => setFilter('weather')}
            className={`bg-slate-800/50 border-2 rounded-xl p-6 cursor-pointer transition ${
              filter === 'weather' ? 'border-orange-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🌪️</div>
            <div className="text-3xl font-bold text-orange-400">{summary.weather}</div>
            <div className="text-sm text-slate-400">Weather Alerts</div>
          </div>

          <div 
            onClick={() => setFilter('tsunami')}
            className={`bg-slate-800/50 border-2 rounded-xl p-6 cursor-pointer transition ${
              filter === 'tsunami' ? 'border-cyan-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🌊</div>
            <div className="text-3xl font-bold text-cyan-400">{summary.tsunami}</div>
            <div className="text-sm text-slate-400">Tsunami Warnings</div>
          </div>

          <div 
            onClick={() => setFilter('earthquake')}
            className={`bg-slate-800/50 border-2 rounded-xl p-6 cursor-pointer transition ${
              filter === 'earthquake' ? 'border-red-500' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-3xl font-bold text-red-400">{summary.earthquake}</div>
            <div className="text-sm text-slate-400">Earthquakes</div>
          </div>
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400 mt-4">Loading government alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-slate-300">No {filter !== 'all' ? filter : ''} alerts at this time</p>
            <p className="text-slate-500 mt-2">This is good news! Oceans are safe.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border-2 p-6 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{getAlertIcon(alert.type)}</div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">{alert.source}</span>
                      </div>
                      <p className="text-sm font-semibold mb-2">Severity: {alert.severity}</p>
                      <p className="text-slate-300 mb-3">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>📍 {alert.location}</span>
                        <span>🕐 {new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      {alert.coordinates && (
                        <a
                          href={`https://www.google.com/maps?q=${alert.coordinates.lat},${alert.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300"
                        >
                          🗺️ View on Map →
                        </a>
                      )}
                      {alert.instruction && (
                        <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                          <p className="font-semibold text-white mb-2">⚠️ Instructions:</p>
                          <p className="text-sm text-slate-300">{alert.instruction}</p>
                        </div>
                      )}
                      {alert.url && (
                        <a
                          href={alert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300"
                        >
                          📄 More Details →
                        </a>
                      )}
                    </div>
                  </div>
                  {alert.expiresAt && (
                    <div className="text-right text-xs text-slate-500">
                      Expires: {new Date(alert.expiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
