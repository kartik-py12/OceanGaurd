
import React, { useState } from 'react';
import { newsArticles } from '../constants';
import { Page } from '../types';

interface NewsFeedPageProps {
  onNavigate: (page: Page) => void;
}

const NewsCard: React.FC<{ article: typeof newsArticles[0] }> = ({ article }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden group">
        <div className="relative">
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">{article.title}</h3>
            </div>
        </div>
        <div className="p-4">
            <p className="text-slate-300 text-sm">{article.summary}</p>
        </div>
    </div>
);

export const NewsFeedPage: React.FC<NewsFeedPageProps> = ({ onNavigate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 8;
    const totalPages = Math.ceil(newsArticles.length / articlesPerPage);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900" style={{ backgroundImage: "url('https://picsum.photos/seed/newsbg/1920/1080')", backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
            <div className="bg-slate-900/80 backdrop-blur-sm min-h-screen">
                {/* Header */}
                 <header className="py-4">
                    <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
                        <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4c-2.31 0-4.43.9-6 2.37L12 13.5l6-7.13C16.43 4.9 14.31 4 12 4z"/></svg>
                        <span className="text-xl font-bold text-white">Ocean Hazards</span>
                    </div>
                    <nav className="flex items-center space-x-6 text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(Page.MAP) }} className="text-slate-300 hover:text-white">Map</a>
                        <a href="#" className="text-slate-300 hover:text-white">Reports</a>
                        <a href="#" className="text-white font-semibold">News</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                         <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors text-white">Login</button>
                         <img src="https://picsum.photos/seed/user/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-slate-600"/>
                    </div>
                    </div>
                </header>

                <main className="container mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-white">Ocean Hazard News Feed</h1>
                        <p className="text-lg text-slate-300 mt-2">The latest updates on marine environmental dangers and events.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center justify-center mb-8 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                        <select className="bg-slate-700 border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Hazard Type</option>
                            <option>Oil Spill</option>
                            <option>Debris</option>
                            <option>Pollution</option>
                        </select>
                        <select className="bg-slate-700 border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Region</option>
                        </select>
                        <input type="date" className="bg-slate-700 border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <select className="bg-slate-700 border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Sort By</option>
                        </select>
                    </div>

                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newsArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage).map(article => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-12 space-x-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-slate-700 rounded-md disabled:opacity-50">&lt;</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-slate-700 rounded-md disabled:opacity-50">&gt;</button>
                    </div>
                </main>
            </div>
        </div>
    );
};
