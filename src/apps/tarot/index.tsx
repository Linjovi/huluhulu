import React, { useState, useEffect, useRef } from 'react';
import { getDeck, CARD_BACK_URL, SPREAD_CONFIGS } from './constants';
import { TarotCard, DrawnCard, GameStage, SpreadConfig } from './types';
import Card from './components/Card';
import Button from './components/Button';
import { getTarotReading } from './services/geminiService';
import { Sparkles, RefreshCw, Star, Loader2, ArrowRight, ChevronLeft, Send, Feather } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Loading messages
const LOADING_MESSAGES = [
  "喵~ 正在链接灵性位面...",
  "喵呜... 正在解读星辰的轨迹...",
  "嘘... 正在聆听牌灵的低语喵...",
  "命运的齿轮正在转动喵...",
  "正在汇聚宇宙的能量喵..."
];

const TAROT_CAT_AVATAR = "https://youke1.picui.cn/s1/2025/12/03/692ff02f94dd5.png";

interface AppProps {
  onBack: () => void;
}

const App: React.FC<AppProps> = ({ onBack }) => {
  const [stage, setStage] = useState<GameStage>('intro');
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig>(SPREAD_CONFIGS[1]); // Default to Triangle
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [userQuestion, setUserQuestion] = useState('');
  
  // Animation state for "flying" card
  const [animatingCard, setAnimatingCard] = useState<{index: number, startX: number, startY: number} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Ref to track current stage for async callbacks
  const stageRef = useRef(stage);

  // Initialize deck
  useEffect(() => {
    setDeck(getDeck());
  }, []);

  // Update stage ref
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Cycle loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleStartIntro = () => {
    setStage('input_question');
  };

  const handleConfirmQuestion = () => {
    setStage('spread_selection');
  };

  const handleSelectSpread = (spread: SpreadConfig) => {
    setSelectedSpread(spread);
    setStage('shuffling');
    // Simulate shuffle duration
    setTimeout(() => {
      // Check ref to ensure user hasn't navigated away
      if (stageRef.current === 'shuffling') {
        setStage('drawing');
      }
    }, 2500);
  };

  const handleBack = () => {
    // Reset transient states
    setLoading(false);
    setAnimatingCard(null);
    switch (stage) {
      case 'input_question':
        setStage('intro');
        break;
      case 'spread_selection':
        setStage('input_question');
        break;
      case 'drawing':
        // Abort drawing, go back to spread selection to re-select
        setStage('spread_selection');
        setDrawnCards([]);
        setDeck(getDeck());
        break;
      case 'reading':
      case 'result':
        // Abort reading, go back to spread selection (or input question if prefered, but spread selection is safer)
        setStage('spread_selection');
        setDrawnCards([]);
        setReading('');
        setDeck(getDeck()); // Reshuffle for next time
        break;
      default:
        break;
    }
  };

  const handleDrawCard = (index: number, e: React.MouseEvent) => {
    if (drawnCards.length >= selectedSpread.cards || animatingCard !== null) return;
    // Logic to select card
    const selectedCardIndex = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[selectedCardIndex];
    
    // Trigger animation
    setAnimatingCard({ index: index, startX: e.clientX, startY: e.clientY });
    const newDeck = [...deck];
    newDeck.splice(selectedCardIndex, 1);
    setDeck(newDeck);

    // Use dynamic position names from the selected spread config
    const positionInfo = selectedSpread.positions[drawnCards.length];
    const newDrawnCard: DrawnCard = {
      ...selectedCard,
      position: positionInfo.name,
      isRevealed: false
    };

    // Delay adding the card to the "drawn" pile to simulate travel time
    setTimeout(() => {
        // Only update if we are still drawing (user didn't click back)
        if (stageRef.current === 'drawing') {
            setDrawnCards(prev => [...prev, newDrawnCard]);
            setAnimatingCard(null); 
        }
    }, 600);
  };

  // Auto-transition when all cards drawn
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (drawnCards.length === selectedSpread.cards && stage === 'drawing' && animatingCard === null) {
      timer = setTimeout(() => {
        setStage('reading'); 
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [drawnCards, stage, animatingCard, selectedSpread.cards]);

  const handleReveal = async (index: number) => {
    if (drawnCards[index].isRevealed) return;

    const newCards = [...drawnCards];
    newCards[index].isRevealed = true;
    setDrawnCards(newCards);

    // Check if all revealed
    if (newCards.every(c => c.isRevealed) && !reading && !loading) {
        await generateInterpretation(newCards);
    }
  };

  const generateInterpretation = async (cards: DrawnCard[]) => {
    setLoading(true);
    // Scroll to bottom to show loading
    setTimeout(() => {
      if (stageRef.current === 'reading') {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    const result = await getTarotReading(cards, selectedSpread.name, userQuestion);
    
    // Safety check: ensure we are still in the reading stage
    if (stageRef.current !== 'reading') return;

    setReading(result);
    setLoading(false);
    setStage('result');
    
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const resetGame = () => {
    setStage('intro');
    setDrawnCards([]);
    setReading('');
    setUserQuestion('');
    setDeck(getDeck());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-[#0f0c29] to-black text-gray-200 flex flex-col overflow-x-hidden relative font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* Bottom Back Button (Flow Content) */}
      {stage !== 'intro' && stage !== 'shuffling' && (
        <div className="w-full flex justify-center pb-8 z-50 animate-fade-in">
          <button 
            onClick={handleBack}
            className="px-6 py-2 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30 rounded-full text-indigo-200 hover:text-yellow-100 hover:bg-indigo-900 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] active:scale-95 group hover:border-yellow-500/30 text-sm"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif tracking-widest">返回上一步喵</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="p-6 text-center z-10 animate-fade-in pt-12 md:pt-6">
        <p className="text-indigo-200 text-xs md:text-sm mt-3 font-light tracking-[0.2em] uppercase opacity-80">
          喵呜~ 洞悉过去 · 把握当下 · 预见未来
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto min-h-[600px]">
        
        {/* STAGE: INTRO */}
        {stage === 'intro' && (
          <div className="text-center space-y-10 animate-fade-in w-full max-w-md">
            <div className="relative w-48 h-48 mx-auto transform transition-all hover:scale-105 duration-700 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] rounded-full overflow-hidden border-4 border-indigo-500/30">
               <img 
                src={TAROT_CAT_AVATAR} 
                className="w-full h-full object-cover" 
                alt="Tarot Cat"
              />
               <div className="absolute -inset-4 bg-gradient-to-t from-purple-500/20 to-transparent blur-xl rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-6 backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5">
              <p className="text-lg text-indigo-100 leading-relaxed font-serif">
                心诚则灵，万物皆有回响喵。
                <br/>
                跟随直觉，探索未知的命运吧喵~
              </p>
              <Button onClick={handleStartIntro} className="mt-4 w-full md:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> 开启喵旅程
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* STAGE: INPUT QUESTION */}
        {stage === 'input_question' && (
          <div className="w-full max-w-lg animate-fade-in space-y-8 text-center bg-indigo-950/30 p-8 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
             <div className="space-y-4">
                <Feather className="w-10 h-10 text-yellow-500 mx-auto opacity-80" />
                <h2 className="text-2xl font-serif text-yellow-100 tracking-widest">
                  心中的困惑
                </h2>
                <p className="text-indigo-300 text-sm font-light leading-relaxed">
                  请闭上双眼，深呼吸喵~ <br/>
                  在心中默念你想要询问的问题，即使不写下来，本喵也会知晓你的心意。
                </p>
             </div>
             <div className="relative group">
               <textarea
                 value={userQuestion}
                 onChange={(e) => setUserQuestion(e.target.value)}
                 placeholder="（选填）在此输入你的问题喵..."
                 className="w-full bg-black/40 border-b-2 border-indigo-500/30 text-center text-lg py-4 px-2 text-yellow-100 placeholder-indigo-500/50 focus:outline-none focus:border-yellow-500 transition-colors resize-none rounded-t-lg min-h-[100px]"
                 maxLength={200}
               />
               <div className="absolute bottom-2 right-2 text-xs text-indigo-500/50">
                 {userQuestion.length}/200
               </div>
             </div>
             <Button onClick={handleConfirmQuestion} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  确认并选择牌阵 <ArrowRight className="w-4 h-4" />
                </span>
             </Button>
          </div>
        )}

        {/* STAGE: SPREAD SELECTION */}
        {stage === 'spread_selection' && (
          <div className="w-full max-w-2xl animate-fade-in space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-yellow-100 tracking-widest">选择你的牌阵喵</h2>
                {userQuestion && (
                    <p className="text-sm text-indigo-300 italic truncate max-w-md mx-auto">
                        "{userQuestion}"
                    </p>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPREAD_CONFIGS.map((spread) => (
                <div 
                  key={spread.id}
                  onClick={() => handleSelectSpread(spread)}
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
                    {Array.from({length: spread.cards}).map((_, i) => (
                      <div key={i} className="w-4 h-6 bg-indigo-500/50 rounded-sm border border-indigo-300/30"></div>
                    ))}
                  </div>
                  <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE: SHUFFLING */}
        {stage === 'shuffling' && (
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
        )}

        {/* STAGE: DRAWING */}
        {stage === 'drawing' && (
          <div className="w-full text-center flex flex-col h-full justify-between py-4">
            <h2 className="text-2xl font-serif text-yellow-100 mb-4 animate-fade-in">
              请凭直觉抽取 {selectedSpread.cards - drawnCards.length} 张牌喵
            </h2>
            
            {/* Dynamic Drawn Slots */}
             <div className={`flex justify-center flex-wrap gap-4 md:gap-8 mb-8 min-h-[160px] md:min-h-[220px] transition-all duration-500`}>
              {Array.from({ length: selectedSpread.cards }).map((_, i) => {
                  const card = drawnCards[i];
                  const label = selectedSpread.positions[i]?.name || `位置 ${i + 1}`;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 transition-all duration-500">
                        <span className="text-xs uppercase tracking-widest text-indigo-400 font-serif max-w-[100px] truncate">{label}</span>
                        <div className="relative w-24 h-36 md:w-32 md:h-48 rounded-lg border-2 border-dashed border-indigo-500/30 flex items-center justify-center bg-indigo-900/10 transition-all duration-500">
                            {card ? (
                                <div className="absolute inset-0 animate-land-card">
                                    <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-lg shadow-lg" alt="Back" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500/30"></div>
                                </div>
                            )}
                        </div>
                    </div>
                  );
              })}
            </div>
            {/* The "Spread" Fan */}
            <div className="relative h-40 md:h-48 w-full max-w-2xl mx-auto mt-auto perspective-1000 group">
              {[...Array(22)].map((_, i) => {
                  const rot = (i - 11) * 4;
                  const y = Math.abs(i - 11) * 3;
                  const isHidden = animatingCard?.index === i;
                  return (
                    <div 
                    key={i}
                    onClick={(e) => !isHidden && handleDrawCard(i, e)}
                    className={`absolute left-1/2 bottom-0 w-16 h-24 md:w-20 md:h-32 origin-bottom-center 
                        cursor-pointer transition-all duration-300 ease-out border border-white/10 rounded-lg shadow-xl
                        ${isHidden ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 hover:-translate-y-6 hover:scale-110 z-10 hover:z-50 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]'}
                    `}
                    style={{
                        marginLeft: '-2rem',
                        transform: `translateX(${(i - 11) * 12}px) rotate(${rot}deg) translateY(${y}px)`,
                    }}
                    >
                    <img src={CARD_BACK_URL} className="w-full h-full object-cover rounded-lg" alt="" />
                    </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE: READING / REVEAL */}
        {(stage === 'reading' || stage === 'result') && (
          <div className="w-full flex flex-col items-center gap-8 pb-20 animate-fade-in">
            
            <div className="flex flex-wrap gap-8 justify-center w-full mt-4">
              {drawnCards.map((card, index) => (
                <div key={card.id} className="flex flex-col items-center gap-4 group">
                  <span className="text-yellow-500 font-serif text-sm tracking-[0.2em] border-b border-yellow-500/30 pb-1 max-w-[150px] text-center truncate">
                    {card.position}
                  </span>
                  
                  <div className="relative">
                    <Card 
                        card={card} 
                        isRevealed={card.isRevealed} 
                        onClick={() => handleReveal(index)}
                        width="w-32 md:w-48"
                        className="shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    />
                    {card.isRevealed && (
                         <div className="absolute inset-0 bg-yellow-400/10 blur-xl -z-10 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className={`text-center transition-all duration-700 transform ${card.isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <h3 className="font-bold text-white text-lg font-serif">{card.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded border ${card.isReversed ? 'border-red-400 text-red-300' : 'border-emerald-400 text-emerald-300'} font-mono uppercase bg-black/40`}>
                        {card.isReversed ? '逆位' : '正位'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt to reveal */}
            {!drawnCards.every(c => c.isRevealed) && (
               <div className="mt-8 animate-bounce text-indigo-300 font-serif tracking-widest flex items-center gap-2">
                   <Star className="w-4 h-4" /> 点击卡牌揭示命运喵 <Star className="w-4 h-4" />
               </div>
            )}

            {/* Loading AI */}
            {loading && (
              <div className="flex flex-col items-center gap-4 mt-12 animate-fade-in py-8" ref={scrollRef}>
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500/50 relative z-10 animate-pulse">
                        <img src={TAROT_CAT_AVATAR} className="w-full h-full object-cover" alt="Loading" />
                    </div>
                    <Loader2 className="w-32 h-32 text-yellow-500 animate-spin absolute -top-4 -left-4 opacity-50" />
                    <div className="absolute inset-0 blur-lg bg-yellow-500/30 animate-pulse"></div>
                </div>
                <p className="text-purple-200 font-serif text-lg tracking-widest mt-4">{loadingMsg}</p>
              </div>
            )}

            {/* Result */}
            {reading && !loading && (
              <div ref={resultRef} className="w-full max-w-3xl relative mt-12 group perspective-1000 animate-fade-in-up">
                 
                 <div className="relative bg-[#1a1638]/80 backdrop-blur-md border border-yellow-500/20 rounded-xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                     {/* Decorative corners */}
                     <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-xl"></div>
                     <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-xl"></div>
                     <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-xl"></div>
                     <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-xl"></div>

                     {userQuestion && (
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <h3 className="text-sm uppercase tracking-widest text-indigo-400 mb-2">你的问题</h3>
                            <p className="text-xl text-yellow-100 font-serif italic">"{userQuestion}"</p>
                        </div>
                     )}

                     <div className="prose prose-invert prose-yellow max-w-none font-serif text-justify">
                        <ReactMarkdown>{reading}</ReactMarkdown>
                     </div>
                 </div>
                 
                 <div className="mt-12 flex justify-center pb-8">
                    <Button onClick={resetGame} variant="secondary">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> 重新占卜喵
                      </span>
                    </Button>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full p-6 text-center text-xs text-indigo-400/30 relative z-10 font-serif tracking-widest uppercase">
        <p>Mystic AI Tarot &copy; 2024</p>
      </footer>

      <style>{`
        @keyframes shuffle {
          0% { transform: translateX(0) rotate(0); }
          50% { transform: translateX(4px) rotate(2deg); }
          100% { transform: translateX(-4px) rotate(-2deg); }
        }
        @keyframes landCard {
            0% { transform: translateY(100px) scale(0.5); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-land-card {
            animation: landCard 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        .origin-bottom-center {
            transform-origin: bottom center;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
