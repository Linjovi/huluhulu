import React from 'react';
import Button from '../Button';
import { Sparkles } from 'lucide-react';

interface IntroStageProps {
    onStart: () => void;
    avatarUrl: string;
}

const IntroStage: React.FC<IntroStageProps> = ({ onStart, avatarUrl }) => {
    return (
        <div className="text-center space-y-10 animate-fade-in w-full max-w-md">
            <div className="relative w-48 h-48 mx-auto transform transition-all hover:scale-105 duration-700 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] rounded-full overflow-hidden border-4 border-indigo-500/30">
                <img
                    src={avatarUrl}
                    className="w-full h-full object-cover"
                    alt="Tarot Cat"
                />
                <div className="absolute -inset-4 bg-gradient-to-t from-purple-500/20 to-transparent blur-xl rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-6 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5">
                <p className="text-lg text-indigo-100 leading-relaxed font-serif">
                    心诚则灵，万物皆有回响喵。
                    <br />
                    跟随直觉，探索未知的命运吧喵~
                </p>
                <Button onClick={onStart} className="mt-4 w-full md:w-auto">
                    <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> 开启喵旅程
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default IntroStage;
