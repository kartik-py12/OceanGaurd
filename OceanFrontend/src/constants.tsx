import React from 'react';
import {  HazardType, type HazardReport, type NewsArticle, type SocialMediaReport } from './types';

// SVG Icons
export const OilSpillIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.843C4.837 3.843 2.001 8.442 2.001 12c0 2.502 1.334 5.234 3.251 7.441.74-2.31 2.37-4.83 4.19-6.559-1.998.487-3.924 2.016-3.924 4.118 0 .552.448 1 1 1s1-.448 1-1c0-1.134.916-2.05 2.05-2.05s2.05.916 2.05 2.05c0 .552.448 1 1 1s1-.448 1-1c0-2.102-1.926-3.631-3.924-4.118 1.82 1.729 3.45 4.248 4.19 6.559C18.667 17.234 20.001 14.502 20.001 12c0-3.558-2.836-8.157-10.001-8.157zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.001 1.843z" /></svg>
);
export const DebrisIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H3v2h1v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8h1V6zM9 4h6v2H9V4zm8 16H7V8h10v12z" /></svg>
);
export const PollutionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" /></svg>
);
export const OtherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
);
export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
);

export const hazardReports: HazardReport[] = [
    { id: 1, type: HazardType.DEBRIS, location: { lat: 30.0, lng: -140.0 }, severity: 8, description: 'Large cluster of plastic and fishing net debris, part of the Great Pacific Garbage Patch.', reportedBy: 'CoastalGuardians', timestamp: '2 hours ago', imageUrl: 'https://picsum.photos/seed/debris1/400/300', verified: true },
    { id: 2, type: HazardType.OIL_SPILL, location: { lat: 28.7, lng: -89.5 }, severity: 9, description: 'Significant oil slick spotted in the Gulf of Mexico.', reportedBy: 'OceanWatchers', timestamp: '5 hours ago', imageUrl: 'https://picsum.photos/seed/oilspill1/400/300', verified: true },
    { id: 3, type: HazardType.POLLUTION, location: { lat: 20.0, lng: 90.0 }, severity: 6, description: 'Chemical runoff causing discolored water in the Bay of Bengal.', reportedBy: 'EcoWarriors', timestamp: '1 day ago', imageUrl: 'https://picsum.photos/seed/pollution1/400/300', verified: false },
];

export const socialMediaReports: SocialMediaReport[] = [
    { id: 1, platform: 'Twitter', user: '@OceanExplorer', text: 'Spotted a large debris field near the Canary Islands. Looks like plastic waste. #MarineDebris', location: { lat: 28.1, lng: -15.4 }, timestamp: '15 mins ago', userAvatar: 'https://picsum.photos/seed/social1/40/40' },
    { id: 2, platform: 'Reddit', user: 'u/DeepSeaWatcher', text: 'Water discoloration seen off the coast of Florida. Could be an algal bloom. #RedTide', location: { lat: 27.9, lng: -82.8 }, timestamp: '1 hour ago', userAvatar: 'https://picsum.photos/seed/social2/40/40' },
    { id: 3, platform: 'Twitter', user: '@SailForChange', text: 'Sad to see so much fishing gear abandoned near Hawaii. This is a huge threat to local wildlife. #GhostNets', location: { lat: 21.3, lng: -157.8 }, timestamp: '3 hours ago', userAvatar: 'https://picsum.photos/seed/social3/40/40' },
];

export const newsArticles: NewsArticle[] = [
    { id: 1, title: 'Detected Off Coast', summary: 'An oil tanker has run aground, causing a significant spill that threatens local marine ecosystems.', imageUrl: 'https://picsum.photos/seed/news1/400/300', category: 'Oil Spill', date: '2023-10-26' },
    { id: 2, title: 'Algal Bloom Spreads', summary: 'A massive harmful algal bloom is rapidly expanding, causing \'dead zones\' and impacting marine life.', imageUrl: 'https://picsum.photos/seed/news2/400/300', category: 'Pollution', date: '2023-10-25' },
    { id: 3, title: 'Coral Bleaching Worsens', summary: 'Experts warn of an expanding mass bleaching event on record due to rising sea temperatures.', imageUrl: 'https://picsum.photos/seed/news3/400/300', category: 'Climate', date: '2023-10-24' },
    { id: 4, title: 'Closed Due to Iceberg', summary: 'A major shipping lane in the north Atlantic has been temporarily closed due to a massive drifting iceberg.', imageUrl: 'https://picsum.photos/seed/news4/400/300', category: 'Other', date: '2023-10-23' },
    { id: 5, title: 'Hurricane Upgraded to Category 5', summary: 'Coastal residents are on high alert as a hurricane intensifies, posing a severe threat.', imageUrl: 'https://picsum.photos/seed/news5/400/300', category: 'Weather', date: '2023-10-22' },
    { id: 6, title: 'After Undersea Quake', summary: 'An 8.2 magnitude undersea earthquake has triggered a tsunami warning for several Pacific islands.', imageUrl: 'https://picsum.photos/seed/news6/400/300', category: 'Geological', date: '2023-10-21' },
    { id: 7, title: 'Plastic Debris Field Discovered', summary: 'A new, massive field of plastic debris, larger than Texas, has been identified in the South Pacific Gyre.', imageUrl: 'https://picsum.photos/seed/news7/400/300', category: 'Debris', date: '2023-10-20' },
    { id: 8, title: 'Levels Reach Critical Point', summary: 'New data shows ocean acidification has reached a critical point, threatening shelled populations globally.', imageUrl: 'https://picsum.photos/seed/news8/400/300', category: 'Pollution', date: '2023-10-19' },
];

export const mentionVolumeData = [
    { name: 'Week 1', mentions: 2000 },
    { name: 'Week 2', mentions: 3200 },
    { name: 'Week 3', mentions: 1800 },
    { name: 'Week 4', mentions: 2780 },
];

export const mentionsByPlatformData = [
    { name: 'Reddit', value: 400 },
    { name: 'Instagram', value: 300 },
    { name: 'Facebook', value: 200 },
    { name: 'Twitter', value: 278 },
];

export const topKeywords = ['#OilSpill', '#MarineDebris', '#Cyclone', '#PlasticWaste', '#Pollution', '#RedTide', '#Flooding', '#CoralBleaching', '#BeachCleanup'];

export const highImpactPosts = [
    { platform: 'Twitter', text: '"Major #OilSpill reported off the coast. Devastating impact on marine life. Authorities are responding. #OceanCrisis"', engagement: '15.2K', imageUrl: 'https://picsum.photos/seed/post1/400/300', url: '' },
    { platform: 'Facebook', text: '"Our community #BeachCleanup was a huge success! Look at all the #PlasticWaste we removed. We can make a difference!"', engagement: '8.7K', imageUrl: 'https://picsum.photos/seed/post2/400/300', url: '' },
    { platform: 'Reddit', text: '"Satellite images show the scale of the #Cyclone forming in the bay. Stay safe everyone."', engagement: '5.1K', imageUrl: 'https://picsum.photos/seed/post3/400/300', url: '' },
    { platform: 'Twitter', text: '"Heartbreaking to see the impact of the #RedTide on local fish populations. We need urgent action."', engagement: '4.8K', imageUrl: 'https://picsum.photos/seed/post4/400/300', url: '' },
];

export const sentimentData = [
    { name: 'Negative', value: 65, fill: '#ef4444' },
    { name: 'Neutral', value: 20, fill: '#64748b' },
    { name: 'Positive', value: 15, fill: '#22c55e' },
];

export const emergingThreatsData = [
    { term: '#JavaOilSpill', growth: '+250%', description: 'Reports of a new spill near Indonesia.' },
    { term: '#RedTideFlorida', growth: '+180%', description: 'Increased sightings of algal blooms.' },
    { term: '#GhostNetPacific', growth: '+95%', description: 'Campaign to remove abandoned fishing nets.' },
];

export const topInfluencersData = [
    { name: 'Ocean Conservancy', handle: '@OceanConservancy', avatar: 'https://picsum.photos/seed/inf1/40/40', followers: '2.1M' },
    { name: 'National Geographic', handle: '@NatGeo', avatar: 'https://picsum.photos/seed/inf2/40/40', followers: '280M' },
    { name: 'Greenpeace', handle: '@Greenpeace', avatar: 'https://picsum.photos/seed/inf3/40/40', followers: '3.5M' },
    { name: 'Dr. Ayana Johnson', handle: '@ayanaeliza', avatar: 'https://picsum.photos/seed/inf4/40/40', followers: '150K' },
];
