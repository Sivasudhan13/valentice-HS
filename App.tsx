
import React, { useState, useEffect, useRef } from 'react';
import { generateLoveLetter, generateRomanticArt, generateRelationshipReport } from './services/geminiService';
import FloatingHearts from './components/FloatingHearts';
import MemoryWall from './components/MemoryWall';
import { Memory, LoveLetterParams } from './types';

// Personal photos provided by the user
const userPhotos = [
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.04 PM.jpeg', title: 'Our Beautiful Moment', desc: 'A memory captured forever in time.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.05 PM (1).jpeg', title: 'Together Always', desc: 'Every moment with you is precious.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.05 PM (2).jpeg', title: 'Our Love Story', desc: 'The journey we share together.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.05 PM.jpeg', title: 'Sweet Memories', desc: 'Moments that make my heart smile.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.06 PM (1).jpeg', title: 'Forever Us', desc: 'A promise to never let go.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.06 PM (2).jpeg', title: 'Our Journey', desc: 'Every step taken hand in hand.' },
  { url: '/assets/images/WhatsApp Image 2026-01-27 at 2.32.06 PM.jpeg', title: 'Eternal Bond', desc: 'A love that knows no end.' }
];

const memories: Memory[] = userPhotos.map((p, i) => ({
  id: String(i + 1),
  date: 'A Beautiful Moment',
  title: p.title,
  description: p.desc,
  imageUrl: p.url
}));

type PhotoFilter = 'none' | 'sepia(0.5) contrast(1.1)' | 'grayscale(1) contrast(1.2)' | 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)';

const App: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'proposal' | 'question' | 'verification' | 'loveStory' | 'celebration' | 'main'>('intro');
  const [verificationStep, setVerificationStep] = useState<'signature' | 'fingerprint'>('signature');
  const [storyStep, setStoryStep] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<PhotoFilter>('none');
  const [husbandName] = useState('Sivasudhan');
  const [wifeName] = useState('Harini');
  const [loading, setLoading] = useState<boolean>(false);
  const [letter, setLetter] = useState<string>('');
  const [romanticArt, setRomanticArt] = useState<string>('');
  const [storyArts, setStoryArts] = useState<string[]>([]);
  const [report, setReport] = useState<string>('');
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showMaybePlea, setShowMaybePlea] = useState(false);
  const [isFingerprinting, setIsFingerprinting] = useState(false);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [loveBubbles, setLoveBubbles] = useState<number[]>([]);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const loveStoryQuestions = [
    { q: "Harini, do you truly love your hubby Sivasudhan? ❤️", placeholder: "Tell him how much...", prompt: "A beautiful garden of infinite roses with two intertwined golden rings" },
    { q: "What is the one thing about Sivasudhan that makes your heart skip a beat? ✨", placeholder: "Is it his smile? His kindness?...", prompt: "An ethereal portrait of a man's kind eyes reflecting a galaxy of stars" },
    { q: "Describe your dream life with him in just a few words. 🏡", placeholder: "Traveling the world? Growing old together?...", prompt: "A cozy cottage by a calm lake at sunset with two chairs on the porch" },
  ];

  useEffect(() => {
    if (stage === 'verification' && verificationStep === 'signature' && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 250;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#881337';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [stage, verificationStep]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isFingerprinting) {
      interval = setInterval(() => {
        setFingerprintProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsFingerprinting(false);
            setStage('loveStory');
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      setFingerprintProgress(0);
    }
    return () => clearInterval(interval);
  }, [isFingerprinting]);

  const moveNoButton = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchstart') e.preventDefault();
    const padding = 20;
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    const randomX = Math.max(padding, Math.min(maxX, Math.random() * maxX));
    const randomY = Math.max(padding, Math.min(maxY, Math.random() * maxY));
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const triggerLoveBubbles = () => {
    setLoveBubbles(prev => [...prev, Date.now()]);
    setTimeout(() => {
      setLoveBubbles(prev => prev.slice(1));
    }, 2000);
  };

  const handleNextStoryStep = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    triggerLoveBubbles();
    
    try {
      const currentStep = loveStoryQuestions[storyStep];
      const art = await generateRomanticArt(`Romantic visualization of Harini's love: ${userInput}. Style: ${currentStep.prompt}`);
      setStoryArts(prev => [...prev, art]);
      
      if (storyStep < loveStoryQuestions.length - 1) {
        setStoryStep(prev => prev + 1);
        setUserInput('');
      } else {
        await finalizeJourney();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const finalizeJourney = async () => {
    setLoading(true);
    try {
      const generatedReport = await generateRelationshipReport(husbandName, wifeName);
      setReport(generatedReport);
      const [newLetter, newArt] = await Promise.all([
        generateLoveLetter({ trait1: 'infinite kindness', trait2: 'radiant soul', favoriteMemory: 'every moment spent with you', tone: 'romantic' }),
        generateRomanticArt(`A majestic portrait of Sivasudhan and Harini, representing their divine eternal marriage bond`)
      ]);
      setLetter(newLetter);
      setRomanticArt(newArt);
      setStage('celebration');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const forwardToHubby = () => {
    const text = `Hi Sivasudhan! Harini has just completed our Eternal Marriage Registry. Check it out here! ❤️`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Our Eternal Bond', text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const element = reportRef.current;
    // @ts-ignore
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Marriage_Certificate_Harini_Sivasudhan.pdf`);
  };

  // Intro Component
  if (stage === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
        <FloatingHearts />
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl z-10 border border-white text-center animate-fadeIn">
          <div className="text-6xl mb-6">💖</div>
          <h1 className="font-serif text-3xl text-rose-950 mb-4 tracking-tight">Welcome, Harini.</h1>
          <p className="text-gray-600 italic mb-8">Sivasudhan has crafted this digital world for you...</p>
          <button onClick={() => setStage('proposal')} className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all shadow-xl active:scale-95">Enter the Journey</button>
        </div>
      </div>
    );
  }

  // Proposal Component
  if (stage === 'proposal') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-100 p-4">
        <FloatingHearts />
        <div className="max-w-xl w-full bg-white p-10 rounded-[3rem] shadow-2xl z-10 text-center animate-fadeIn relative">
          {showMaybePlea && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full animate-bounce px-4">
              <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-lg inline-block relative font-medium text-sm">hubby pavom kojam pathu poduma plch 🙏🥺</div>
            </div>
          )}
          <h2 className="font-serif text-3xl md:text-4xl text-rose-900 mb-10 leading-snug">Do you still love Sivasudhan?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => setStage('question')} className="w-full sm:w-auto px-10 py-4 bg-rose-600 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform active:scale-95">YES! ❤️</button>
            <button onClick={() => setShowMaybePlea(true)} className="w-full sm:w-auto px-10 py-4 border-2 border-rose-200 text-rose-400 rounded-2xl font-bold text-xl hover:bg-rose-50 active:scale-95">Maybe... 😉</button>
          </div>
        </div>
      </div>
    );
  }

  // Eternal Question
  if (stage === 'question') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-200 p-4 overflow-hidden relative">
        <FloatingHearts />
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-2xl z-10 text-center border-4 border-white">
          <h1 className="font-cursive text-6xl md:text-7xl text-rose-500 mb-4">Harini,</h1>
          <h2 className="font-serif text-3xl md:text-5xl text-rose-950 mb-12 font-bold leading-tight">Will you be mine forever?</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center h-auto md:h-24">
            <button onClick={() => setStage('verification')} className="w-full md:w-auto px-12 py-5 bg-rose-600 text-white rounded-3xl font-bold text-2xl hover:scale-110 shadow-2xl z-20 active:scale-95">ALWAYS! ♾️</button>
            <button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} style={{ left: noButtonPos.x ? `${noButtonPos.x}px` : 'auto', top: noButtonPos.y ? `${noButtonPos.y}px` : 'auto', position: noButtonPos.x ? 'fixed' : 'relative', zIndex: 100 }} className="w-full md:w-auto px-10 py-5 border-2 border-rose-300 text-rose-400 rounded-3xl font-bold text-xl no-button bg-white/80">No</button>
          </div>
        </div>
      </div>
    );
  }

  // Verification Step
  if (stage === 'verification') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
        <FloatingHearts />
        <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl z-10 text-center border-2 border-rose-100">
          {verificationStep === 'signature' ? (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">Step 1: Sign the Decree</h2>
              <p className="text-gray-500 italic">Harini, draw your signature below to seal the bond.</p>
              <div className="bg-rose-50 rounded-2xl p-2 border-2 border-rose-100 relative overflow-hidden">
                <canvas ref={canvasRef} height={250} className="w-full bg-white cursor-crosshair rounded-xl shadow-inner touch-none" onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} onTouchStart={startDrawing} onTouchEnd={stopDrawing} onTouchMove={draw} />
                <button onClick={clearSignature} className="absolute bottom-4 right-4 text-rose-400 text-xs font-bold uppercase tracking-widest hover:text-rose-600 bg-white/50 px-2 py-1 rounded">Clear</button>
              </div>
              <button onClick={() => setVerificationStep('fingerprint')} className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-700 active:scale-95 transition-all">Next: Thumbprint →</button>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">Step 2: Fingerprint Scan</h2>
              <p className="text-gray-500 italic">Hold your thumb down to verify your divine soul.</p>
              <div className="flex justify-center py-8">
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center relative transition-all duration-300 ${isFingerprinting ? 'scale-110 shadow-[0_0_30px_rgba(225,29,72,0.4)]' : 'shadow-lg'}`} onMouseDown={() => setIsFingerprinting(true)} onMouseUp={() => setIsFingerprinting(false)} onTouchStart={() => setIsFingerprinting(true)} onTouchEnd={() => setIsFingerprinting(false)}>
                  <div className="absolute inset-0 bg-rose-100 rounded-full border-4 border-rose-200"></div>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="#fb7185" strokeWidth="8" strokeDasharray="477" strokeDashoffset={477 - (477 * fingerprintProgress) / 100} className="transition-all duration-100" />
                  </svg>
                  <div className="z-10 text-rose-500"><svg className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0110 3v4m12 8V9a10 10 0 00-10-10H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-5m-5 0l-4-3m4 3l4-3" /></svg></div>
                </div>
              </div>
              <p className={`text-rose-600 font-bold transition-opacity ${isFingerprinting ? 'opacity-100' : 'opacity-0'}`}>Scanning Identity... {fingerprintProgress}%</p>
              {!isFingerprinting && <p className="text-gray-400 text-sm animate-pulse">Press and Hold to Authenticate</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Interactive Love Story
  if (stage === 'loveStory') {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <FloatingHearts />
        {loveBubbles.map(id => (
           <div key={id} className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="absolute animate-bounce text-3xl md:text-4xl" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 2 + 1}s` }}>💖</div>
              ))}
           </div>
        ))}

        <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[3rem] shadow-2xl z-10 border border-white animate-fadeIn">
          {loading ? (
             <div className="py-16 space-y-6">
                <div className="text-6xl animate-pulse">🌹</div>
                <h2 className="font-serif text-xl md:text-2xl text-rose-900 italic">Capturing your love story with Sivasudhan...</h2>
             </div>
          ) : (
             <>
               <div className="flex justify-between items-center mb-6">
                 <span className="text-rose-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Step {storyStep + 1} / 3</span>
                 <div className="flex gap-2">
                    {['Original', 'Vintage', 'Noir', 'Glow'].map((f, idx) => (
                      <button 
                        key={f}
                        onClick={() => setCurrentFilter([ 'none', 'sepia(0.5) contrast(1.1)', 'grayscale(1) contrast(1.2)', 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)'][idx] as PhotoFilter)}
                        className={`text-[8px] md:text-[10px] px-2 py-1 rounded-full border ${currentFilter === [ 'none', 'sepia(0.5) contrast(1.1)', 'grayscale(1) contrast(1.2)', 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)'][idx] ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-400'}`}
                      >
                        {f}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-rose-100 bg-rose-50 flex items-center justify-center relative">
                  {/* Show corresponding user photo for each step */}
                  <img 
                    src={userPhotos[storyStep].url} 
                    alt="Our Memory" 
                    className="w-full h-48 md:h-64 object-cover transition-all duration-700"
                    style={{ filter: currentFilter }}
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full">{userPhotos[storyStep].title}</div>
               </div>

               <h2 className="font-serif text-xl md:text-3xl text-rose-900 mb-6">{loveStoryQuestions[storyStep].q}</h2>

               <textarea
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 className="w-full h-24 md:h-32 p-4 border-2 border-rose-100 rounded-2xl focus:border-rose-300 focus:outline-none font-serif italic text-base md:text-lg text-rose-900 placeholder-rose-200"
                 placeholder={loveStoryQuestions[storyStep].placeholder}
               />
               <button 
                 onClick={handleNextStoryStep}
                 disabled={!userInput.trim()}
                 className="w-full mt-6 bg-rose-600 text-white py-4 rounded-xl font-bold text-lg md:text-xl hover:bg-rose-700 transition-all disabled:opacity-50 active:scale-95"
               >
                 {storyStep === loveStoryQuestions.length - 1 ? "Finalize Our Union ♾️" : "Continue the Story ✨"}
               </button>
             </>
          )}
        </div>
      </div>
    );
  }

  // Celebration / Final Report
  if (stage === 'celebration') {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center py-8 px-4 text-center">
        <FloatingHearts />
        <div className="max-w-4xl w-full animate-fadeIn">
           <div ref={reportRef} className="bg-[#fffcf5] p-6 md:p-16 rounded-sm shadow-2xl border-[10px] md:border-[20px] border-rose-900 relative mb-12 overflow-hidden text-rose-950" style={{ borderStyle: 'double' }}>
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]"></div>
              <div className="border border-rose-200 p-6 md:p-12 relative">
                 <div className="text-center mb-10">
                    <div className="text-rose-900 text-5xl mb-4">❦</div>
                    <h1 className="font-serif text-2xl md:text-5xl uppercase tracking-[0.2em] font-bold border-b-2 border-rose-100 pb-4 inline-block">Certificate of Eternal Marriage</h1>
                    <p className="font-serif text-[10px] md:text-sm mt-4 uppercase tracking-widest text-rose-400 font-semibold italic">Official Decree of Love</p>
                 </div>
                 <div className="text-center space-y-8 mb-16">
                    <p className="font-serif text-base md:text-xl italic">This document officially confirms the divine union between</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 py-6">
                      <div className="text-center">
                         <p className="font-cursive text-4xl md:text-6xl text-rose-800 border-b border-rose-200 px-4">{husbandName}</p>
                         <p className="text-[10px] uppercase mt-2 text-gray-400 tracking-widest">The Husband</p>
                      </div>
                      <div className="text-3xl font-serif text-rose-300 italic md:block hidden">&</div>
                      <div className="text-center">
                         <p className="font-cursive text-4xl md:text-6xl text-rose-800 border-b border-rose-200 px-4">{wifeName}</p>
                         <p className="text-[10px] uppercase mt-2 text-gray-400 tracking-widest">The Wife</p>
                      </div>
                    </div>
                    <div className="prose prose-sm md:prose-base prose-rose max-w-none text-left leading-relaxed text-gray-800 font-serif italic py-8 border-y border-rose-50 px-4 whitespace-pre-wrap">{report}</div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end text-center mt-20">
                    <div className="space-y-2"><p className="font-cursive text-2xl text-rose-800 border-b border-gray-300 pb-1 italic">{husbandName}</p><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Husband's Signature</p></div>
                    <div className="flex flex-col items-center"><div className="w-24 h-24 border-4 border-rose-100 rounded-full flex items-center justify-center text-rose-600 text-[10px] font-bold uppercase rotate-12 bg-rose-50/50">Seal of<br/>Forever</div><p className="text-[10px] uppercase text-gray-300 mt-4 tracking-widest">Official Seal ∞</p></div>
                    <div className="space-y-2"><p className="font-cursive text-2xl text-rose-800 border-b border-gray-300 pb-1 italic">{wifeName}</p><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Wife's Signature</p></div>
                 </div>
                 <div className="mt-16 text-[9px] uppercase tracking-[0.4em] text-gray-300 font-serif">Registry No: {Date.now()} | Authenticated by Harini</div>
              </div>
           </div>
           <div className="flex flex-col md:flex-row gap-4 justify-center relative z-20">
              <button onClick={downloadPDF} className="bg-rose-950 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl">📜 Download Decree (PDF)</button>
              <button onClick={forwardToHubby} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-all active:scale-95 shadow-xl">📲 Share with Sivasudhan ❤️</button>
              <button onClick={() => setStage('main')} className="bg-rose-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-rose-700 transition-all active:scale-95 shadow-xl">See Our Memories ✨</button>
           </div>
        </div>
      </div>
    );
  }

  // Main Memories View
  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 pb-20 overflow-x-hidden selection:bg-rose-200">
      <FloatingHearts />
      <header className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
        <div className="z-10 animate-fadeIn">
          <h2 className="font-cursive text-5xl md:text-7xl text-rose-500 mb-4 tracking-tight drop-shadow-sm">Always & Forever,</h2>
          <h1 className="font-serif text-6xl md:text-9xl text-rose-900 mb-8 font-black tracking-tighter leading-none">{wifeName}</h1>
          <p className="font-serif text-xl md:text-2xl text-rose-700 italic max-w-2xl mx-auto px-4 leading-relaxed">
            "Sivasudhan loves you more than words can ever describe. You are his heart, his world, his everything."
          </p>
        </div>
        <div className="absolute bottom-10 animate-bounce text-rose-300"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>
      </header>

      <section className="max-w-6xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-white grid md:grid-cols-2">
           <div className="p-8 md:p-16 bg-rose-50/30 flex items-center justify-center">
              <div className="w-full space-y-12 animate-fadeIn py-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 to-pink-200 rounded-3xl blur opacity-25"></div>
                  <div className="relative bg-white font-cursive text-3xl md:text-4xl text-rose-900 leading-[1.6] max-h-[600px] overflow-y-auto pr-4 p-4">
                    {letter || "My dearest Harini, every breath I take is a testament to our bond..."}
                  </div>
                </div>
              </div>
           </div>
           <div className="p-8 md:p-16 flex items-center justify-center bg-white relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-rose-50 transform rotate-1 transition-all hover:rotate-0 hover:scale-[1.02] duration-500 w-full max-w-sm">
                <img src={romanticArt || userPhotos[2].url} alt="Eternal Art" className="w-full aspect-square object-cover" />
                <div className="p-4 text-center bg-rose-50 font-serif text-rose-900 italic">"The Eternal Bond"</div>
              </div>
           </div>
        </div>
      </section>

      <section className="py-24 bg-rose-100/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-rose-500 font-semibold uppercase tracking-[0.3em] text-sm mb-4 block">Our Photo Collection</span>
            <h2 className="font-serif text-4xl md:text-5xl text-rose-900 mb-6">Treasured Moments</h2>
            
            <div className="flex justify-center gap-3 mt-8">
                {['No Filter', 'Vintage', 'Noir', 'Warmth'].map((f, i) => (
                  <button 
                    key={f}
                    onClick={() => setCurrentFilter(['none', 'sepia(0.5) contrast(1.1)', 'grayscale(1) contrast(1.2)', 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)'][i] as PhotoFilter)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentFilter === ['none', 'sepia(0.5) contrast(1.1)', 'grayscale(1) contrast(1.2)', 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)'][i] ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-rose-400 hover:bg-rose-50'}`}
                  >
                    {f}
                  </button>
                ))}
            </div>
            
            <div className="w-24 h-1 bg-rose-300 mx-auto rounded-full mt-10 opacity-50"></div>
          </div>
          
          <MemoryWall memories={memories} />
        </div>
      </section>

      <footer className="text-center py-20 px-6">
        <div className="font-cursive text-4xl text-rose-400 mb-6">With All My Love, Sivasudhan</div>
        <p className="font-serif text-rose-900/40 text-sm tracking-widest uppercase italic">Harini & Sivasudhan — 2024 Eternal Registry</p>
      </footer>
    </div>
  );
};

export default App;
