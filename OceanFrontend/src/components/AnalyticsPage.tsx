import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mentionVolumeData, topKeywords, highImpactPosts, sentimentData, emergingThreatsData, topInfluencersData } from '../constants';
import { Page } from '../types';

interface AnalyticsPageProps {
  onNavigate: (page: Page) => void;
}

const AnalyticsSidebar: React.FC<{ activePage: string; onNav: (page: string) => void }> = ({ activePage, onNav }) => {
    const navItems = [
        { name: 'Dashboard', page: 'Dashboard'},
        { name: 'Reports', page: 'Reports'},
        { name: 'Map View', page: 'Map'},
        { name: 'Social Analytics', page: 'Social Analytics'}
    ];

    return (
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 p-6 flex flex-col">
            <div className="flex items-center space-x-2 mb-10">
                <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4c-2.31 0-4.43.9-6 2.37L12 13.5l6-7.13C16.43 4.9 14.31 4 12 4z"/></svg>
                <span className="text-xl font-bold text-white">OceanWatch</span>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <a href="#" key={item.name} 
                       onClick={(e) => { e.preventDefault(); onNav(item.name); }}
                       className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${activePage === item.name ? 'bg-blue-600/30 text-blue-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="mt-auto">
                 <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg">New Report</button>
            </div>
        </aside>
    );
};

const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'positive' | 'negative' }> = ({ title, value, change, changeType }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-white my-2">{value}</p>
        {change && (
            <p className={`text-sm font-semibold ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
            </p>
        )}
    </div>
);

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
    const [activePage, setActivePage] = useState('Social Analytics');
    
    const handleSidebarNav = (page: string) => {
        if (page === 'Map View') onNavigate(Page.MAP);
        else setActivePage(page);
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-300">
            <AnalyticsSidebar activePage={activePage} onNav={handleSidebarNav} />
            <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundImage: "radial-gradient(circle at top right, rgba(14, 165, 233, 0.1), transparent 40%)" }}>
                <h1 className="text-3xl font-bold text-white mb-2">Social Media Analytics Dashboard</h1>
                <p className="text-slate-400 mb-8">Real-time insights on ocean hazard conversations</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <StatCard title="Total Mentions (30d)" value="1.2M" change="+15.2%" changeType="positive" />
                    <StatCard title="Overall Sentiment" value="Largely Negative" change="65% Negative" changeType="negative" />
                    <StatCard title="Top Platform" value="Twitter" change="45% of mentions" changeType="positive" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Mention Volume */}
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Mention Volume Over Time</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mentionVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                    <Line type="monotone" dataKey="mentions" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Sentiment Analysis</h2>
                        <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                                        {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="flex justify-center space-x-4 mt-4 text-sm">
                            {sentimentData.map(entry => (
                                <div key={entry.name} className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                                    <span>{entry.name} ({entry.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                     {/* Emerging Threats */}
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Emerging Threats</h2>
                        <div className="space-y-4">
                            {emergingThreatsData.map((threat) => (
                                <div key={threat.term} className="border-l-4 border-yellow-400 pl-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-white">{threat.term}</span>
                                        <span className="text-sm font-bold text-yellow-400">{threat.growth}</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{threat.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Top Keywords */}
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Top Hazard Keywords</h2>
                        <div className="flex flex-wrap gap-3">
                            {topKeywords.map(keyword => (
                                <span key={keyword} className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">{keyword}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl lg:col-span-1">
                        <h2 className="text-xl font-semibold text-white mb-4">Top Influencers</h2>
                        <div className="space-y-4">
                            {topInfluencersData.map(influencer => (
                                <div key={influencer.handle} className="flex items-center space-x-4">
                                    <img src={influencer.avatar} alt={influencer.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="font-semibold text-white">{influencer.name}</p>
                                        <p className="text-sm text-slate-400">{influencer.handle} &middot; {influencer.followers} followers</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl lg:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-4">High Impact Media</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...highImpactPosts, {imageUrl: 'https://picsum.photos/seed/post5/400/300', text: 'Another image...'}, {imageUrl: 'https://picsum.photos/seed/post6/400/300', text: 'Another image...'}].slice(0, 4).map((post, index) => (
                                <div key={index} className="relative aspect-video group">
                                    <img src={post.imageUrl} className="w-full h-full object-cover rounded-lg"/>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <p className="text-white text-xs line-clamp-2">{post.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                 {/* Recent High-Impact Posts */}
                 <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent High-Impact Posts</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700 text-sm text-slate-400">
                                <th className="py-2">Source</th>
                                <th className="py-2">Post Snippet</th>
                                <th className="py-2 text-right">Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {highImpactPosts.map((post, index) => (
                                <tr key={index} className="border-b border-slate-800">
                                    <td className="py-4 font-semibold text-white">{post.platform}</td>
                                    <td className="py-4 text-slate-300">{post.text}</td>
                                    <td className="py-4 text-right font-bold text-white">{post.engagement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>

            </main>
        </div>
    );
};