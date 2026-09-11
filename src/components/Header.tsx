import React from 'react';
import { Sparkles, Armchair, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onShowGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowGuide }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
            <Armchair className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                AI 제품 제안 카드
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                가구·인테리어 상담용
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              제품 사진 분석 기반 맞춤형 고객 상담 제안서 자동 생성
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-show-guide"
            onClick={onShowGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-orange-600 hover:bg-orange-50 border border-stone-200 transition-colors"
            title="사용 가이드 및 작성 팁"
          >
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span className="hidden md:inline">상담 가이드</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 text-xs text-stone-700 px-2.5 py-1 bg-stone-100 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Gemini Vision</span>
          </div>
        </div>
      </div>
    </header>
  );
};
