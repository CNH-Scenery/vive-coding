import React, { useState, useEffect } from 'react';
import UploadCard from './components/UploadCard';
import ResultCard from './components/ResultCard';
import { processImages as processImagesAPI } from './services/apiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    currentPhoto: null,
    desiredPhoto: null,
    currentPhotoPreview: null,
    desiredPhotoPreview: null,
    advice: null,
    simulation: null,
    salons: [],
    error: null,
    location: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.warn("Location access denied. Maps features will be limited.", error);
        }
      );
    }
  }, []);

  const handleCurrentPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setState(prev => ({
        ...prev,
        currentPhoto: file,
        currentPhotoPreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDesiredPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setState(prev => ({
        ...prev,
        desiredPhoto: file,
        desiredPhotoPreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const processImages = async () => {
    if (!state.currentPhoto || !state.desiredPhoto) return;

    setIsLoading(true);
    setState(prev => ({ ...prev, step: 'analyzing', error: null }));

    try {
      // Call backend API for all processing
      const response = await processImagesAPI(
        state.currentPhoto,
        state.desiredPhoto,
        state.location
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || '처리에 실패했습니다.');
      }

      setState(prev => ({
        ...prev,
        step: 'results',
        advice: response.data!.advice,
        simulation: response.data!.simulation,
        salons: response.data!.salons
      }));

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        step: 'upload',
        error: err.message || "처리에 실패했습니다. 잠시 후 다시 시도해주세요."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      step: 'upload',
      currentPhoto: null,
      desiredPhoto: null,
      currentPhotoPreview: null,
      desiredPhotoPreview: null,
      advice: null,
      simulation: null,
      salons: [],
      error: null
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 selection:bg-violet-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-700/50 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
             <span className="text-2xl">✨</span>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
               StyleSync AI
             </h1>
          </div>
          {state.step === 'results' && (
             <button 
               onClick={reset}
               className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
             >
               새로 만들기
             </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Intro Text */}
        {state.step === 'upload' && (
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              당신에게 어울리는 <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">완벽한 스타일</span>을 찾아보세요
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              현재 모습과 원하는 스타일 사진을 올려주세요.<br />
              AI가 시뮬레이션 결과와 전문가 가이드, 그리고 맞춤 미용실을 추천해드립니다.
            </p>
          </div>
        )}

        {/* Upload Step */}
        {state.step === 'upload' && !isLoading && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <UploadCard 
                label="현재 내 머리 사진" 
                imagePreview={state.currentPhotoPreview} 
                onFileSelect={handleCurrentPhoto}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
              />
              <UploadCard 
                label="원하는 스타일 사진" 
                imagePreview={state.desiredPhotoPreview} 
                onFileSelect={handleDesiredPhoto}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                }
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={processImages}
                disabled={!state.currentPhoto || !state.desiredPhoto}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-violet-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-700 hover:scale-105 active:scale-95"
              >
                스타일 분석 & 시뮬레이션 시작
                <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
              </button>
            </div>
            
            {state.error && (
               <div className="text-center text-red-400 mt-4 bg-red-900/20 p-4 rounded-xl mx-auto max-w-md">
                 {state.error}
               </div>
            )}
          </div>
        )}

        {/* Loading Step */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 border-t-4 border-violet-500 rounded-full animate-spin"></div>
               <div className="absolute inset-3 border-t-4 border-fuchsia-400 rounded-full animate-spin reverse-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}></div>
             </div>
             <h3 className="text-2xl font-bold text-slate-200 mb-2">스타일 분석 중...</h3>
             <p className="text-slate-400 animate-pulse">
               AI가 얼굴을 분석하고 새로운 헤어스타일을 디자인하고 있습니다.<br/>
               잠시만 기다려주세요 (약 10-20초 소요)
             </p>
          </div>
        )}

        {/* Results Step */}
        {state.step === 'results' && state.advice && (
          <div className="space-y-12 animate-fade-in-up">
            
            {/* Simulation Result */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
               {/* Left: Images */}
               <div className="space-y-6">
                 <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[3/4] md:aspect-square">
                   {state.simulation ? (
                     <img 
                       src={state.simulation} 
                       alt="Simulated Result" 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-6 text-center">
                       <span className="text-4xl mb-4">🤔</span>
                       <p>이미지 생성에 실패했습니다.<br/>텍스트 분석 결과를 참고해주세요.</p>
                     </div>
                   )}
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-semibold">
                     AI 시뮬레이션 결과
                   </div>
                 </div>
               </div>

               {/* Right: Advice Card */}
               <div className="lg:sticky lg:top-24">
                  <ResultCard advice={state.advice} salons={state.salons} />
               </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default App;