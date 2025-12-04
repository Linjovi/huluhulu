import React from 'react';
import Button from '../Button';
import { ArrowRight, Feather } from 'lucide-react';

interface InputQuestionStageProps {
    question: string;
    setQuestion: (q: string) => void;
    onConfirm: () => void;
}

const InputQuestionStage: React.FC<InputQuestionStageProps> = ({ question, setQuestion, onConfirm }) => {
    return (
        <div className="w-full max-w-lg animate-fade-in space-y-8 text-center bg-indigo-950/30 p-8 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
            <div className="space-y-4">
                <Feather className="w-10 h-10 text-yellow-500 mx-auto opacity-80" />
                <h2 className="text-2xl font-serif text-yellow-100 tracking-widest">
                    心中的困惑
                </h2>
                <p className="text-indigo-300 text-sm font-light leading-relaxed">
                    请闭上双眼，深呼吸喵~ <br />
                    在心中默念你想要询问的问题，即使不写下来，本喵也会知晓你的心意。
                </p>
            </div>
            <div className="relative group">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="（选填）在此输入你的问题喵..."
                    className="w-full bg-black/40 border-b-2 border-indigo-500/30 text-center text-lg py-4 px-2 text-yellow-100 placeholder-indigo-500/50 focus:outline-none focus:border-yellow-500 transition-colors resize-none rounded-t-lg min-h-[100px]"
                    maxLength={200}
                />
                <div className="absolute bottom-2 right-2 text-xs text-indigo-500/50">
                    {question.length}/200
                </div>
            </div>
            <Button onClick={onConfirm} className="w-full">
                <span className="flex items-center justify-center gap-2">
                    确认并选择牌阵 <ArrowRight className="w-4 h-4" />
                </span>
            </Button>
        </div>
    );
};

export default InputQuestionStage;
