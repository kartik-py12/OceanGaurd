
import React, { useState, useEffect } from 'react';
import { HazardType } from '../types';
import { OilSpillIcon, DebrisIcon, PollutionIcon, OtherIcon, LocationIcon } from '../constants';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';

interface ReportHazardWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const HazardTypeButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon, label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 w-full aspect-square
      ${isSelected ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500 text-slate-300'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const LocationPicker: React.FC<{
  location: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
}> = ({ location, setLocation }) => {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };
  
  const customMarkerIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={3}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[location.lat, location.lng]} icon={customMarkerIcon}/>
      <MapEvents />
    </MapContainer>
  );
};


export const ReportHazardWizard: React.FC<ReportHazardWizardProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [hazardType, setHazardType] = useState<HazardType>(HazardType.OIL_SPILL);
  const [severity, setSeverity] = useState(5);
  const [location, setLocation] = useState({ lat: 20.0, lng: 0.0 });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmissionStatus('idle');
      setHazardType(HazardType.OIL_SPILL);
      setSeverity(5);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('success');
      setTimeout(() => {
        onSubmit();
      }, 1500);
    }, 2000);
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Pinpoint the Location';
      case 2: return 'Provide Details';
      case 3: return 'Confirm and Submit';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="relative h-80 flex flex-col">
            <div className="mb-4">
              <input type="text" placeholder="Search or click on the map to set location" className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div className="flex-grow bg-slate-900/50 rounded-lg">
                <LocationPicker location={location} setLocation={setLocation} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Hazard Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <HazardTypeButton icon={<OilSpillIcon className="w-8 h-8" />} label="Oil Spill" isSelected={hazardType === HazardType.OIL_SPILL} onClick={() => setHazardType(HazardType.OIL_SPILL)} />
                <HazardTypeButton icon={<DebrisIcon className="w-8 h-8" />} label="Debris" isSelected={hazardType === HazardType.DEBRIS} onClick={() => setHazardType(HazardType.DEBRIS)} />
                <HazardTypeButton icon={<PollutionIcon className="w-8 h-8" />} label="Pollution" isSelected={hazardType === HazardType.POLLUTION} onClick={() => setHazardType(HazardType.POLLUTION)} />
                <HazardTypeButton icon={<OtherIcon className="w-8 h-8" />} label="Other" isSelected={hazardType === HazardType.OTHER} onClick={() => setHazardType(HazardType.OTHER)} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Severity Level</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">Low</span>
                <input type="range" min="1" max="10" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <span className="text-sm text-slate-400">High</span>
              </div>
               <div className="text-center mt-2 text-slate-300 font-medium">Medium ({severity}/10)</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Description (Optional)</h3>
              <textarea placeholder="Add any additional details about the hazard..." rows={4} className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Upload Photo (Optional)</h3>
              <input type="file" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {[{label: 'Location', value: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`, icon: <LocationIcon className="w-5 h-5 text-slate-400"/> },
             {label: 'Hazard Type', value: hazardType, icon: <OtherIcon className="w-5 h-5 text-slate-400"/>},
             {label: 'Severity', value: `High (${severity}/10)`, icon: <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/></svg>},
             {label: 'Photo', value: <img src="https://picsum.photos/seed/review/100/60" alt="hazard" className="rounded-md"/>, icon: <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>},
             {label: 'Description', value: 'A large, dark patch spotted near the coast. Approximately 2 miles.', icon: <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}].map(item => (
                <div key={item.label} className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-start">
                        <div className="mr-4 mt-1">{item.icon}</div>
                        <div>
                            <p className="font-semibold text-slate-300">{item.label}</p>
                            <div className="text-slate-100">{item.value}</div>
                        </div>
                    </div>
                    <button className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-md" onClick={() => setStep(item.label === 'Location' ? 1 : 2)}>Edit</button>
                </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl text-white">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Report a New Hazard</h2>
            <p className="text-slate-400">Step {step}: {getStepTitle()}</p>
          </div>
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <p className="text-right text-sm text-slate-400 mt-2">Step {step} of {totalSteps}</p>
          </div>
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>
        </div>
        <div className="bg-slate-900/50 px-8 py-4 rounded-b-2xl flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            &larr; Back
          </button>
          {step < totalSteps && (
            <button onClick={handleNext} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
              Next &rarr;
            </button>
          )}
          {step === totalSteps && (
            <div className="flex items-center space-x-2">
                 {submissionStatus === 'idle' && (
                    <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
                      Submit Report
                    </button>
                  )}
                  {submissionStatus === 'submitting' && (
                    <button disabled className="px-6 py-2 bg-blue-500/50 rounded-lg font-semibold flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </button>
                  )}
                  {submissionStatus === 'success' && (
                    <button disabled className="px-6 py-2 bg-green-600 rounded-lg font-semibold flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      Success
                    </button>
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
