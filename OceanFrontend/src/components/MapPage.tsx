
import React, { useState } from 'react';
import { hazardReports, socialMediaReports } from '../constants';
import { MapContainer, TileLayer, Marker, ImageOverlay } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { HazardType, Page, type HazardReport, type SocialMediaReport } from '../types';

interface MapPageProps {
  onReportHazard: () => void;
  onNavigate: (page: Page) => void;
}

const Header: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 z-[1000] p-4">
        <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-md p-3 rounded-xl border border-slate-700">
             <div className="flex items-center space-x-2">
                <svg className="w-7 h-7 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4c-2.31 0-4.43.9-6 2.37L12 13.5l6-7.13C16.43 4.9 14.31 4 12 4z"/></svg>
                <span className="text-lg font-bold text-white">Ocean Hazard Watch</span>
             </div>
             <div className="flex-1 max-w-xl mx-4">
                 <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search by location, coordinates, or region" className="w-full bg-slate-900/70 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
             </div>
             <div className="flex items-center space-x-4">
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">Login</button>
                <img src="https://picsum.photos/seed/user/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-slate-600"/>
            </div>
        </div>
    </header>
);

interface SidebarProps {
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showSocialMedia: boolean;
  onToggleSocialMedia: () => void;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showHeatmap, onToggleHeatmap, showSocialMedia, onToggleSocialMedia, onNavigate }) => (
    <aside className="absolute top-1/2 -translate-y-1/2 left-4 z-[1000] w-72 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 space-y-6">
        <div>
            <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
            <p className="text-sm text-slate-400">Refine map data</p>
        </div>
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-300">Data Layers</h3>
            <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" defaultChecked disabled className="accent-blue-500 w-4 h-4 bg-slate-700 border-slate-600 rounded opacity-50" /> <span className="opacity-50">Hazard Reports</span></label>
            <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked={showHeatmap} onChange={onToggleHeatmap} className="accent-blue-500 w-4 h-4 bg-slate-700 border-slate-600 rounded" /><span>Heatmaps</span></label>
            <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked={showSocialMedia} onChange={onToggleSocialMedia} className="accent-blue-500 w-4 h-4 bg-slate-700 border-slate-600 rounded" /><span>Social Media Reports</span></label>
        </div>
         <div className="space-y-4">
            <h3 className="font-semibold text-slate-300">Time Range</h3>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">2023</span>
                <input type="range" min="2023" max="2024" defaultValue="2024" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <span className="text-sm text-slate-400">Today</span>
            </div>
        </div>
        <div className="pt-4 border-t border-slate-700 space-y-3">
             <h3 className="font-semibold text-slate-300">Explore</h3>
             <button onClick={() => onNavigate(Page.NEWS)} className="w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <span>News Feed</span>
             </button>
             <button onClick={() => onNavigate(Page.ANALYTICS)} className="w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <span>Social Analytics</span>
             </button>
        </div>
    </aside>
);

const HazardDetailCard: React.FC<{ report: HazardReport, onClose: () => void }> = ({ report, onClose }) => (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[1000] w-96 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        <img src={report.imageUrl} alt={report.type} className="rounded-lg w-full h-48 object-cover mb-4" />
        <span className="text-xs font-bold uppercase text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">{report.type}</span>
        <h2 className="text-2xl font-bold text-white mt-2 mb-2">{`${report.type} Report`}</h2>
        {report.verified && <p className="text-sm text-green-400 font-semibold mb-4">Verified Report</p>}
        <div className="space-y-3 text-slate-300">
            <p><strong>Reported:</strong> {report.timestamp}</p>
            <p><strong>Location:</strong> {report.location.lat.toFixed(4)}° N, {report.location.lng.toFixed(4)}° W</p>
            <p className="text-slate-200">{report.description}</p>
             <div className="flex items-center pt-2">
                <img src="https://picsum.photos/seed/reporter/32/32" alt="Reporter" className="w-8 h-8 rounded-full mr-3"/>
                <div>
                    <p className="text-sm text-slate-400">Reported by:</p>
                    <p className="font-semibold text-white">{report.reportedBy}</p>
                </div>
            </div>
        </div>
    </div>
);

const SocialMediaCard: React.FC<{ report: SocialMediaReport, onClose: () => void }> = ({ report, onClose }) => (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[1000] w-96 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        <div className="flex items-center mb-4">
            <img src={report.userAvatar} alt={report.user} className="w-12 h-12 rounded-full mr-4"/>
            <div>
                <p className="font-bold text-white">{report.user}</p>
                <p className="text-sm text-slate-400">{report.platform}</p>
            </div>
        </div>
        <p className="text-slate-200 mb-4">{report.text}</p>
        <div className="text-sm text-slate-400 space-y-1">
            <p><strong>Location:</strong> {report.location.lat.toFixed(4)}°, {report.location.lng.toFixed(4)}°</p>
            <p><strong>Timestamp:</strong> {report.timestamp}</p>
        </div>
    </div>
);

const createPulseIcon = (color: string) => divIcon({
    className: 'custom-pulse-icon',
    html: `
      <div style="position: relative; width: 16px; height: 16px;">
        <div class="pulse-anim" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; opacity: 0.75;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.5);"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

const createSocialIcon = () => divIcon({
    className: 'custom-social-icon',
    html: `
      <div style="position: relative; width: 14px; height: 14px; background-color: #38bdf8; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.7);"></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

export const MapPage: React.FC<MapPageProps> = ({ onReportHazard, onNavigate }) => {
    const [selectedHazard, setSelectedHazard] = useState<HazardReport | null>(hazardReports[0]);
    const [selectedSocialPost, setSelectedSocialPost] = useState<SocialMediaReport | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(true);
    
    const hazardColors: { [key in HazardType]: string } = {
        [HazardType.OIL_SPILL]: '#ef4444', // red-500
        [HazardType.DEBRIS]: '#f97316', // orange-500
        [HazardType.POLLUTION]: '#06b6d4', // cyan-500
        [HazardType.OTHER]: '#8b5cf6', // violet-500
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
             <MapContainer 
                center={[20, -40]} 
                zoom={3} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                minZoom={3}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {showHeatmap && (
                    <ImageOverlay
                        url="https://i.imgur.com/s425y4s.png"
                        bounds={[[50, -120], [10, -70]]}
                        opacity={0.6}
                        zIndex={10}
                    />
                )}

                {hazardReports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.location.lat, report.location.lng]}
                        icon={createPulseIcon(hazardColors[report.type])}
                        eventHandlers={{
                            click: () => {
                                setSelectedHazard(report);
                                setSelectedSocialPost(null);
                            },
                        }}
                    />
                ))}

                {showSocialMedia && socialMediaReports.map((report) => (
                    <Marker
                        key={`social-${report.id}`}
                        position={[report.location.lat, report.location.lng]}
                        icon={createSocialIcon()}
                        eventHandlers={{
                            click: () => {
                                setSelectedSocialPost(report);
                                setSelectedHazard(null);
                            },
                        }}
                    />
                ))}
            </MapContainer>

            <Header />
            <Sidebar 
                showHeatmap={showHeatmap}
                onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                showSocialMedia={showSocialMedia}
                onToggleSocialMedia={() => setShowSocialMedia(!showSocialMedia)}
                onNavigate={onNavigate}
            />

            {selectedHazard && <HazardDetailCard report={selectedHazard} onClose={() => setSelectedHazard(null)} />}
            {selectedSocialPost && <SocialMediaCard report={selectedSocialPost} onClose={() => setSelectedSocialPost(null)} />}
            
            <button 
                onClick={onReportHazard}
                className="absolute bottom-8 right-8 z-[1000] flex items-center space-x-2 bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Report Hazard</span>
            </button>
        </div>
    );
};
