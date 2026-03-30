import React from 'react';
import Button from '../Button';
import { Sparkles } from 'lucide-react';

interface IntroStageProps {
    onStart: () => void;
    avatarUrl: string; // Keeping prop to avoid breaking types, though unused
}

const IntroStage: React.FC<IntroStageProps> = ({ onStart }) => {
    return (
        <div className="text-center space-y-10 animate-fade-in w-full max-w-md">
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
