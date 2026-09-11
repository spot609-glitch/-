import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { TONE_OPTIONS } from '../data/samples';
import { ToneType } from '../types';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onSelectTone: (tone: ToneType) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <span>3. 제안 문체</span>
          <span className="text-orange-600 font-normal text-xs">*필수</span>
        </label>
        <span className="text-xs text-stone-700">고객 응대 스타일에 맞게 선택</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TONE_OPTIONS.map((tone) => {
          const isSelected = selectedTone === tone.id;
          return (
            <button
              key={tone.id}
              type="button"
              id={`tone-option-${tone.id}`}
              onClick={() => onSelectTone(tone.id as ToneType)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-400/30'
                  : 'border-stone-200 bg-white hover:border-orange-300 hover:bg-stone-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'border-orange-600 bg-orange-500 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    {tone.shortLabel}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-orange-200/70 text-orange-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tone.badge}
                </span>
              </div>

              <p className="text-[11px] text-stone-600 leading-snug mb-1.5">
                {tone.description}
              </p>

              <div className="text-[10px] text-stone-600 italic bg-white/80 p-1.5 rounded-md border border-stone-100">
                {tone.example}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
