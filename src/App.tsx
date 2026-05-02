/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Gamepad2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Star,
  Trophy,
  Info
} from 'lucide-react';
import { FractionShape } from './components/FractionShape';
import { sounds } from './lib/sounds';
import { Fraction, Question } from './types';

type GameState = 'menu' | 'tutorial' | 'game' | 'result';

export default function App() {
  const [state, setState] = useState<GameState>('menu');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Tutorial Steps
  const tutorialData = [
    {
      title: "ما هي الكسور؟",
      content: "الكسر هو جزء من الكل. تخيل لو كان عندنا بيتزا وقسمناها!",
      fraction: { numerator: 1, denominator: 2 },
      type: 'circle' as const,
      subText: "هذا النصف (1/2). قطعة واحدة من قطعتين متساويتين."
    },
    {
      title: "النصف (1/2)",
      content: "عندما نقسم الشيء إلى قطعتين متساويتين، نسمي كل قطعة 'نصف'.",
      fraction: { numerator: 1, denominator: 2 },
      type: 'circle' as const,
      subText: "انظر كيف تتقسم الدائرة إلى نصفين!"
    },
    {
      title: "الثلث (1/3)",
      content: "إذا قسمنا الشيء إلى 3 قطع متساوية، كل قطعة هي 'ثلث'.",
      fraction: { numerator: 1, denominator: 3 },
      type: 'square' as const,
      subText: "المربع مقسم لـ 3 أجزاء، ولونا جزءاً واحداً."
    },
    {
      title: "الربع (1/4)",
      content: "أما إذا قسمناه لـ 4 قطع متساوية، فكل قطعة هي 'ربع'.",
      fraction: { numerator: 1, denominator: 4 },
      type: 'circle' as const,
      subText: "زي تقطيع التفاحة لـ 4 قطع!"
    }
  ];

  // Game Generator
  const generateQuestions = () => {
    const denoms = [2, 3, 4, 8];
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < 5; i++) {
      const d = denoms[Math.floor(Math.random() * denoms.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      const correct: Fraction = { numerator: n, denominator: d };
      
      // Generate unique options
      const optionsSet = new Set<string>();
      optionsSet.add(`${n}/${d}`);
      while (optionsSet.size < 3) {
        const randD = denoms[Math.floor(Math.random() * denoms.length)];
        const randN = Math.floor(Math.random() * (randD - 1)) + 1;
        optionsSet.add(`${randN}/${randD}`);
      }
      
      const options = Array.from(optionsSet).map(s => {
        const [num, den] = s.split('/').map(Number);
        return { numerator: num, denominator: den };
      }).sort(() => Math.random() - 0.5);

      newQuestions.push({
        id: `q-${i}`,
        fraction: correct,
        options,
        correctAnswer: correct,
        type: 'identify'
      });
    }
    setQuestions(newQuestions);
  };

  const handleStartGame = () => {
    sounds.playClick();
    setScore(0);
    setCurrentQuestionIdx(0);
    generateQuestions();
    setState('game');
    sounds.speak("هيا لنبدأ التحدي! أي جزء يعبر عن هذا الكسر؟");
  };

  useEffect(() => {
    if (state === 'tutorial') {
      const step = tutorialData[tutorialStep];
      sounds.speak(`${step.title}. ${step.content}`);
    }
  }, [state, tutorialStep]);

  useEffect(() => {
    if (state === 'game' && questions.length > 0) {
      if (showFeedback) return;
      const q = questions[currentQuestionIdx];
      sounds.speak(`السؤال ${currentQuestionIdx + 1}. أين هو الكسر ${q.fraction.numerator} من ${q.fraction.denominator}؟`);
    }
  }, [state, currentQuestionIdx, questions, showFeedback]);

  const handleAnswer = (selected: Fraction) => {
    const currentQ = questions[currentQuestionIdx];
    if (selected.numerator === currentQ.correctAnswer.numerator && 
        selected.denominator === currentQ.correctAnswer.denominator) {
      sounds.playSuccess();
      setScore(s => s + 1);
      setShowFeedback('correct');
    } else {
      sounds.playError();
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(idx => idx + 1);
      } else {
        setState('result');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans bg-natural-bg text-natural-text">
      <AnimatePresence mode="wait">
        {state === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl mx-auto h-screen flex flex-col items-center justify-center p-6 gap-10"
          >
            <motion.div 
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-4 border-leaf-green shadow-xl relative"
            >
              <span className="text-7xl">🦁</span>
              <div className="absolute -bottom-2 -right-2 bg-sun p-2 rounded-full border-2 border-natural-text">
                 <Star className="w-8 h-8 text-natural-text fill-natural-text" />
              </div>
            </motion.div>
            
            <div className="text-center">
              <h1 className="text-6xl font-black text-leaf-green mb-3 tracking-tight drop-shadow-sm">عالم الكسور</h1>
              <p className="text-2xl text-sand font-bold">مغامرة شيقة في عالم الأجزاء!</p>
            </div>

            <div className="w-full flex flex-col gap-6 px-4">
              <button 
                onClick={() => { sounds.playClick(); setState('tutorial'); }}
                className="w-full bg-white border-b-8 border-sand-light active:border-b-0 py-6 px-8 rounded-[32px] flex items-center justify-between text-3xl font-black text-natural-text hover:bg-cream transition-all shadow-md active:translate-y-2"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-sand-light p-3 rounded-2xl text-sand">
                    <BookOpen size={32} />
                  </div>
                  <span>تعلم الكسور</span>
                </div>
                <ArrowLeft className="w-10 h-10 text-sand" />
              </button>

              <button 
                onClick={handleStartGame}
                className="w-full bg-leaf-green border-b-8 border-leaf-dark active:border-b-0 py-6 px-8 rounded-[32px] flex items-center justify-between text-3xl font-black text-white hover:brightness-110 transition-all shadow-md active:translate-y-2"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Gamepad2 size={32} />
                  </div>
                  <span>ابدأ التحدي</span>
                </div>
                <ArrowLeft className="w-10 h-10" />
              </button>
            </div>
          </motion.div>
        )}

        {state === 'tutorial' && (
          <motion.div 
            key="tutorial"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto min-h-screen flex flex-col p-6"
          >
            <nav className="flex items-center justify-between mb-8 h-20 bg-leaf-green px-6 rounded-3xl border-b-4 border-leaf-dark shadow-md text-white font-black">
              <button onClick={() => setState('menu')} className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors">
                <Home size={28} />
              </button>
              <div className="text-2xl">
                درس {tutorialStep + 1} من {tutorialData.length}
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-leaf-dark">
                <span className="text-xl">📚</span>
              </div>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <motion.div
                key={tutorialStep}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] border-4 border-sand-light shadow-sm overflow-hidden p-10 w-full text-center relative"
              >
                 <div className="absolute top-0 right-0 p-4">
                    <span className="bg-sand text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-sm">شرح تفاعلي</span>
                 </div>

                <h2 className="text-4xl font-black text-leaf-green mb-5 mt-4">{tutorialData[tutorialStep].title}</h2>
                <p className="text-2xl text-natural-text font-bold mb-8 leading-relaxed">{tutorialData[tutorialStep].content}</p>
                
                <div className="bg-cream rounded-[32px] p-8 border-4 border-dashed border-moss mb-8 flex justify-center">
                  <FractionShape 
                    numerator={tutorialData[tutorialStep].fraction.numerator}
                    denominator={tutorialData[tutorialStep].fraction.denominator}
                    type={tutorialData[tutorialStep].type}
                    size={220}
                  />
                </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-moss flex items-center gap-6 text-right">
                <div className="w-16 h-16 bg-natural-bg rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0">💡</div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-leaf-green mb-1">تلميح ذكي:</h4>
                  <p className="text-natural-text/80 font-bold">{tutorialData[tutorialStep].subText}</p>
                </div>
                <button 
                  onClick={() => sounds.speak(tutorialData[tutorialStep].subText)} 
                  className="p-2 border-2 border-leaf-green rounded-full text-leaf-green hover:bg-leaf-green hover:text-white transition-colors"
                  title="استمع للتلميح"
                >
                  <span className="text-xl">🔊</span>
                </button>
              </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <button 
                disabled={tutorialStep === 0}
                onClick={() => { sounds.playClick(); setTutorialStep(s => s - 1); }}
                className={`flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-2xl transition-all ${tutorialStep === 0 ? 'bg-sand-light text-white/50 opacity-50' : 'bg-white text-natural-text border-b-4 border-sand-light shadow-md active:border-b-0 active:translate-y-1'}`}
              >
                <ArrowRight size={30} /> السابق
              </button>
              
              {tutorialStep < tutorialData.length - 1 ? (
                <button 
                  onClick={() => { sounds.playClick(); setTutorialStep(s => s + 1); }}
                  className="flex items-center justify-center gap-3 bg-leaf-green text-white py-5 rounded-[24px] font-black text-2xl border-b-4 border-leaf-dark shadow-md active:border-b-0 active:translate-y-1"
                >
                  التالي <ArrowLeft size={30} />
                </button>
              ) : (
                <button 
                  onClick={() => { sounds.playClick(); setState('menu'); }}
                  className="flex items-center justify-center gap-3 bg-sun text-natural-text py-5 rounded-[24px] font-black text-2xl border-b-4 border-[#D9B930] shadow-md active:border-b-0 active:translate-y-1"
                >
                  انطلقت! <CheckCircle2 size={30} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {state === 'game' && questions.length > 0 && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto min-h-screen flex flex-col p-6"
          >
            <nav className="flex items-center justify-between mb-8 h-20 bg-leaf-green px-6 rounded-3xl border-b-4 border-leaf-dark shadow-lg text-white font-black">
              <button onClick={() => setState('menu')} className="p-3 bg-white/20 rounded-2xl">
                <Home size={28} />
              </button>
              
              <div className="flex items-center gap-3 bg-white/20 px-6 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                <span className="text-sun text-2xl">⭐</span>
                <span className="font-black text-2xl">النقاط: {score * 10}</span>
              </div>

              <div className="text-xl font-bold px-4 py-1 bg-leaf-dark rounded-xl">
                {currentQuestionIdx + 1} / {questions.length}
              </div>
            </nav>

            <div className="flex-1 flex flex-col justify-center items-center gap-10">
              <div className="bg-white rounded-[40px] border-4 border-sand-light shadow-sm overflow-hidden p-10 w-full relative">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="bg-sun text-natural-text px-6 py-1.5 rounded-full text-lg font-black shadow-sm">تحدي اليوم</span>
                  <h2 className="text-3xl font-black text-natural-text text-center">أي جزء يعبّر عن هذا الكسر؟</h2>
                </div>

                <div className="bg-cream rounded-[40px] border-4 border-moss flex items-center justify-center py-10 shadow-inner">
                   <FractionShape 
                    numerator={questions[currentQuestionIdx].fraction.numerator}
                    denominator={questions[currentQuestionIdx].fraction.denominator}
                    type={currentQuestionIdx % 2 === 0 ? 'circle' : 'square'}
                    size={240}
                  />
                </div>
                
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-[40px] z-10 backdrop-blur-sm"
                    >
                      {showFeedback === 'correct' ? (
                        <div className="text-center font-black">
                          <div className="w-24 h-24 bg-leaf-green rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl">🦊</div>
                          <p className="text-5xl text-leaf-green">أحسنت يا بطل!</p>
                          <p className="text-2xl text-natural-text mt-2">إجابة رائعة 👏</p>
                        </div>
                      ) : (
                        <div className="text-center font-black">
                          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-red-500 shadow-xl">🦁</div>
                          <p className="text-5xl text-red-500">حاول مجدداً!</p>
                          <p className="text-2xl text-natural-text mt-2">أنت تستطيع فعلها! 💪</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full px-2">
                {questions[currentQuestionIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={!!showFeedback}
                    onClick={() => handleAnswer(opt)}
                    className="bg-white p-6 rounded-[32px] border-b-8 border-sand-light active:border-b-0 active:translate-y-2 hover:bg-cream transition-all flex flex-col items-center justify-center gap-2 group shadow-lg"
                  >
                    <div className="text-5xl font-black text-leaf-green group-hover:scale-110 transition-transform">
                      {opt.numerator}
                    </div>
                    <div className="w-full h-1.5 bg-sand-light rounded-full"></div>
                    <div className="text-5xl font-black text-leaf-green group-hover:scale-110 transition-transform">
                      {opt.denominator}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div 
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl mx-auto min-h-screen flex flex-col items-center justify-center p-6 gap-8 text-center"
          >
            <div className="bg-white rounded-[40px] border-4 border-[#CCD5AE] shadow-2xl p-12 w-full flex flex-col items-center gap-8">
              <div className="relative">
                <Trophy className="w-40 h-40 text-sun drop-shadow-lg" />
                <motion.div 
                   animate={{ scale: [1, 1.2, 1] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute -top-4 -right-4 text-5xl"
                >✨</motion.div>
              </div>

              <div>
                <h2 className="text-6xl font-black text-leaf-green mb-2 tracking-tight">نهاية المغامرة!</h2>
                <p className="text-2xl text-sand font-bold">أنت الآن خبير في الكسور!</p>
              </div>
              
              <div className="bg-cream p-10 rounded-[40px] border-4 border-moss w-full shadow-inner">
                 <div className="text-2xl font-bold text-natural-text mb-2">مجموع النقاط</div>
                 <div className="text-8xl font-black text-leaf-green drop-shadow-sm">
                    {score * 10}
                 </div>
                 <div className="text-xl font-bold text-sand mt-4">
                    إجابات صحيحة: {score} من {questions.length}
                 </div>
              </div>

              <div className="w-full flex flex-col gap-4 mt-4">
                <button 
                  onClick={handleStartGame}
                  className="bg-leaf-green text-white text-3xl font-black py-6 rounded-[32px] border-b-8 border-leaf-dark active:border-b-0 active:translate-y-2 flex items-center justify-center gap-4 shadow-xl"
                >
                  <RotateCcw size={32} /> العب مجدداً
                </button>
                <button 
                  onClick={() => setState('menu')}
                  className="bg-sand-light text-natural-text text-3xl font-black py-6 rounded-[32px] border-b-8 border-[#C4B9A3] active:border-b-0 active:translate-y-2 flex items-center justify-center gap-4 shadow-xl"
                >
                  <Home size={32} /> القائمة الرئيسية
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
