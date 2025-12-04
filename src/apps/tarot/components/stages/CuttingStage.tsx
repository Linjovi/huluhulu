import React from 'react';
import { CARD_BACK_URL } from '../../constants';

interface CuttingStageProps {
    cutOffset: number;
    onCut: () => void;
}

const CuttingStage: React.FC<CuttingStageProps> = ({ cutOffset, onCut }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in">
            <div className="relative w-48 h-72 cursor-pointer group" onClick={onCut}>
                {/* Stack 1 */}
                <div
                    className="absolute inset-0 rounded-xl border border-white/10 shadow-2xl transition-all duration-700 ease-in-out bg-indigo-950"
                    style={{
                        transform: cutOffset ? 'translateX(-60%) rotate(-5deg)' : 'translateX(0) rotate(0)',
                        zIndex: 10
                    }}
                >
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-xl" alt="" />
                    <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
                    {/* Thickness */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="absolute inset-0 bg-indigo-900 rounded-xl border-l border-white/5" style={{ transform: `translate(${i}px, ${i}px)`, zIndex: -1 }}></div>
                    ))}
                </div>

                {/* Stack 2 (Base) */}
                <div
                    className="absolute inset-0 rounded-xl border border-white/10 shadow-2xl transition-all duration-700 ease-in-out bg-indigo-950"
                    style={{
                        transform: cutOffset ? 'translateX(60%) rotate(5deg)' : 'translate(4px, 4px) rotate(0)',
                        zIndex: 5
                    }}
                >
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-xl" alt="" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="absolute inset-0 bg-indigo-900 rounded-xl border-l border-white/5" style={{ transform: `translate(${i}px, ${i}px)`, zIndex: -1 }}></div>
                    ))}
                </div>

                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-yellow-500/50 text-sm font-serif tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    点击切牌
                </div>
            </div>
            <p className="text-xl font-serif text-yellow-100 tracking-widest">
                请点击牌堆切牌，注入你的能量喵
            </p>
        </div>
    );
};

export default CuttingStage;
