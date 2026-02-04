import React from 'react';
import { StyleAdvice } from '../types';

interface ResultCardProps {
  advice: StyleAdvice;
  salons: any[];
}

const ResultCard: React.FC<ResultCardProps> = ({ advice, salons }) => {
  return (
    <div className="bg-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
          {advice.styleName}
        </h2>
        <p className="text-slate-400 text-sm">스타일 분석 결과</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600">
            <h3 className="font-semibold text-violet-300 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
              </svg>
              길이 및 성장 가이드
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {advice.growthGuide}
            </p>
          </div>

          <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600">
            <h3 className="font-semibold text-pink-300 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 00-1.5 0h-2.5a.75.75 0 000 1.5h2.5a.75.75 0 001.5 0zm-14.5 0a.75.75 0 00-1.5 0h2.5a.75.75 0 000 1.5h-2.5zM10 8.5a2 2 0 100 4 2 2 0 000-4zm5.25 2.25a.75.75 0 00-1.5 0h-2.5a.75.75 0 000 1.5h2.5a.75.75 0 001.5 0zm-14.5 0a.75.75 0 00-1.5 0h2.5a.75.75 0 000 1.5h-2.5zM8.5 17.25a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5zm6.5 0a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5z" />
              </svg>
              디자이너 요청 가이드
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {advice.technique}
            </p>
            <div className="mt-3">
               <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">미용실 방문 시 이 내용을 보여주세요</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600">
            <h3 className="font-semibold text-emerald-300 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              스타일링 팁
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {advice.stylingTips}
            </p>
          </div>

          <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600">
            <h3 className="font-semibold text-sky-300 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 01-.61-1.424z" clipRule="evenodd" />
              </svg>
              추천 미용실 (근처)
            </h3>
            {salons.length > 0 ? (
              <ul className="space-y-3">
                {salons.map((salon, idx) => (
                  <li key={idx} className="bg-slate-800 p-3 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3 hover:bg-slate-700 transition-colors">
                    <div>
                       <p className="font-medium text-slate-200">{salon.name}</p>
                       <p className="text-xs text-slate-500">{salon.address}</p>
                    </div>
                    <div className="flex gap-2">
                        {salon.url && (
                            <a 
                              href={salon.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs px-2.5 py-1.5 rounded transition-colors"
                            >
                              Google
                            </a>
                        )}
                        <a 
                          href={`https://map.naver.com/v5/search/${encodeURIComponent(salon.name)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#03C75A] hover:bg-[#02b351] text-white text-xs px-2.5 py-1.5 rounded transition-colors font-medium"
                        >
                          네이버
                        </a>
                        <a 
                          href={`https://map.kakao.com/link/search/${encodeURIComponent(salon.name)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#FEE500] hover:bg-[#e6cf00] text-black text-xs px-2.5 py-1.5 rounded transition-colors font-medium"
                        >
                          카카오
                        </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm">근처에 적합한 미용실 정보를 찾을 수 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
