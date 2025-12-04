import React from 'react';
import { SpreadConfig } from '../../types';
import { SPREAD_CONFIGS } from '../../constants';
import { ArrowRight } from 'lucide-react';

interface SpreadSelectionStageProps {
    question: string;
    onSelect: (spread: SpreadConfig) => void;
}

const SpreadSelectionStage: React.FC<SpreadSelectionStageProps> = ({ question, onSelect }) => {
    return (
        <div className="w-full max-w-2xl animate-fade-in space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-yellow-100 tracking-widest">选择你的牌阵喵</h2>
                {question && (
                    <p className="text-sm text-indigo-300 italic truncate max-w-md mx-auto">
                        "{question}"
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPREAD_CONFIGS.map((spread) => (
                    <div
                        key={spread.id}
                        onClick={() => onSelect(spread)}
                        className={`relative p-6 rounded-xl border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-sm hover:bg-indigo-900/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] group ${spread.cards > 3 ? 'md:col-span-2' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-yellow-200 group-hover:text-yellow-100">{spread.name}</h3>
                            <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded-full border border-indigo-500/50">
                                {spread.cards} 张牌
                            </span>
                        </div>
                        <p className="text-sm text-indigo-200/80 mb-4 h-10 line-clamp-2">{spread.description}</p>

                        {/* Mini Preview of Layout */}
                        <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            {Array.from({ length: spread.cards }).map((_, i) => (
                                <div key={i} className="w-4 h-6 bg-indigo-500/50 rounded-sm border border-indigo-300/30"></div>
                            ))}
                        </div>
                        <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpreadSelectionStage;
