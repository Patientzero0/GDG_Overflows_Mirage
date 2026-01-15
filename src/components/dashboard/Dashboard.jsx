import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic } from 'lucide-react';
import SentimentGauge from './SentimentGauge';
import LivePulseChart from './LivePulseChart';
import MemorySidebar from './MemorySidebar';

const Dashboard = ({ mode, onBack, onConnect }) => {
    const [sentiment, setSentiment] = useState(0);
    const [chartData, setChartData] = useState([]);

    // Mock Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            // Random sentiment between -1 and 1, but smooth
            const newSentiment = Math.sin(Date.now() / 2000) * 0.8 + (Math.random() * 0.2 - 0.1);
            setSentiment(newSentiment);

            setChartData(prev => {
                const newData = [...prev, { time: Date.now(), value: newSentiment }];
                if (newData.length > 60) newData.shift(); // Keep last 60 points
                return newData;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Main Stage */}
            <div className="mr-80 h-screen flex flex-col relative">
                {/* Header */}
                <header className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Selection</span>
                    </button>
                    <div className="bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                        <span className="text-sm font-medium text-white/80">Mode: <span className="text-white font-bold capitalize">{mode}</span></span>
                    </div>
                </header>

                {/* Center Content */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Avatar Placeholder */}
                    <div className="relative w-64 h-64 mb-12">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[60px] animate-pulse"></div>
                        <div className="relative w-full h-full rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${mode}`}
                                alt="Avatar"
                                className="w-40 h-40 opacity-80"
                            />
                            {/* Audio Visualizer Ring (Simple CSS) */}
                            <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full scale-110 animate-ping opacity-20"></div>
                        </div>
                    </div>

                    {/* Sentiment & Charts */}
                    <div className="w-full max-w-2xl px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="flex justify-center">
                                <SentimentGauge value={sentiment} />
                            </div>
                            <div>
                                <LivePulseChart data={chartData} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="p-8 flex justify-center flex-col items-center gap-6">
                    <button
                        onClick={onConnect}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <span>Start Session</span>
                        <ArrowLeft size={18} className="rotate-180" />
                    </button>

                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
                        <button className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                            <Mic size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <span className="text-sm text-white/50">Listening...</span>
                        <div className="flex gap-1 h-4 items-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 bg-white/40 rounded-full animate-pulse" style={{ height: Math.random() * 16 + 4 + 'px', animationDelay: i * 0.1 + 's' }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <MemorySidebar />
        </div>
    );
};

export default Dashboard;
