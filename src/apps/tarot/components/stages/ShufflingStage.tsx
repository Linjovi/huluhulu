import React from 'react';
import { RefreshCw } from 'lucide-react';
import { CARD_BACK_URL } from '../../constants';

const ShufflingStage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            <div className="relative w-48 h-72">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 rounded-xl bg-indigo-950 border border-yellow-500/20 shadow-2xl"
                        style={{
                            animation: `shuffle ${0.8 + i * 0.1}s infinite ease-in-out alternate`,
                            transformOrigin: 'bottom center',
                            zIndex: 10 - i
                        }}
                    >
                        <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-xl opacity-90" alt="" />
                    </div>
                ))}
            </div>
            <p className="text-xl font-serif text-yellow-100 animate-pulse tracking-widest flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" /> 正在洗牌，请保持专注喵...
            </p>
        </div>
    );
};

export default ShufflingStage;
