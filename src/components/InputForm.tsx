import React from 'react';
import { Sparkles, Loader2, MapPin, Tag } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { ToneSelector } from './ToneSelector';
import { QUICK_PURPOSE_TAGS } from '../data/samples';
import { SampleFurniture, ToneType } from '../types';

interface InputFormProps {
  currentImage: string | null;
  onImageChange: (image: string | null, mimeType?: string) => void;
  onSelectSample: (sample: SampleFurniture) => void;
  purpose: string;
  onPurposeChange: (purpose: string) => void;
  selectedTone: ToneType;
  onSelectTone: (tone: ToneType) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  currentImage,
  onImageChange,
  onSelectSample,
  purpose,
  onPurposeChange,
  selectedTone,
  onSelectTone,
  onSubmit,
  isLoading,
}) => {
  const isReady = !!currentImage && !isLoading;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-6">
      <div className="border-b border-stone-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          상담 입력 정보
        </h2>
        <p className="text-xs text-stone-700 mt-1">
          제품 이미지와 공간 목적, 상담 문체를 지정하면 AI가 제안 카드를 생성합니다.
        </p>
      </div>

      {/* 1. 제품 이미지 1장 */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={onImageChange}
        onSelectSample={onSelectSample}
      />

      {/* 2. 사용할 장소나 목적 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="purpose-input"
            className="text-sm font-semibold text-stone-800 flex items-center gap-1.5"
          >
            <span>2. 사용할 장소나 목적</span>
            <span className="text-stone-400 font-normal text-xs">(권장)</span>
          </label>
          <span className="text-[11px] text-stone-500">
            공간 평형, 가구 배치 용도
          </span>
        </div>

        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none text-stone-400">
            <MapPin className="w-4 h-4 text-orange-500" />
          </div>
          <textarea
            id="purpose-input"
            rows={2}
            value={purpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            placeholder="예: 25평 신혼집 거실 중앙에 둘 따뜻한 패브릭 소파, 주말 대화 및 힐링 공간"
            className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 outline-none transition-all placeholder:text-stone-400 resize-none bg-stone-50/50 focus:bg-white"
          />
        </div>

        {/* Quick chip recommendations */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-orange-500" />
            빠른 선택:
          </span>
          {QUICK_PURPOSE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onPurposeChange(tag)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-100 hover:text-orange-800 text-stone-600 transition-colors border border-stone-200/60"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 제안 문체 */}
      <ToneSelector
        selectedTone={selectedTone}
        onSelectTone={onSelectTone}
      />

      {/* 버튼: ‘AI 제안문 만들기’ 1개 */}
      <div className="pt-2">
        <button
          type="button"
          id="btn-generate-proposal"
          disabled={!isReady}
          onClick={onSubmit}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
            isReady
              ? 'bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 hover:shadow-orange-500/35 cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>AI가 제품 사진 분석 및 제안서 작성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>AI 제안문 만들기</span>
            </>
          )}
        </button>

        {!currentImage && (
          <p className="text-center text-xs text-stone-600 mt-2">
            * 상단에서 제품 이미지를 1장 업로드하거나 샘플 가구를 선택해 주세요.
          </p>
        )}
      </div>
    </div>
  );
};
