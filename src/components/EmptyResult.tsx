import React from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';

export const EmptyResult: React.FC = () => {
  return (
    <div
      id="empty-proposal-state"
      className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
    >
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mb-4 shadow-2xs">
        <Sparkles className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-2">
        상담 제안 카드 미리보기
      </span>

      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight mb-2">
        AI 제품 제안 카드가 여기에 생성됩니다
      </h3>
      <p className="text-xs sm:text-sm text-stone-700 max-w-md leading-relaxed mb-6">
        왼쪽에서 가구·인테리어 사진 1장을 올리고, 사용할 장소나 목적과 제안 문체를 선택한 뒤
        <strong className="text-orange-600 font-semibold"> ‘AI 제안문 만들기’</strong> 버튼을 눌러주세요.
      </p>

      {/* Structure Guide Preview */}
      <div className="w-full max-w-md bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-left space-y-3 mb-6">
        <p className="text-xs font-bold text-stone-700 border-b border-stone-200 pb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-500" />
          카드에 담기는 4가지 핵심 결과 항목
        </p>

        <div className="space-y-2 text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-stone-800">제목 및 2~3문장 소개</strong>
              <p className="text-[11px] text-stone-500">
                선택한 상담 문체에 맞춰 고객의 마음에 와닿는 정제된 소개문
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-stone-800">핵심 장점 3가지</strong>
              <p className="text-[11px] text-stone-500">
                사진에서 관찰되는 조형미, 공간감, 디자인 매력 포인트
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-stone-800">추가 확인 정보 2가지</strong>
              <p className="text-[11px] text-stone-500">
                사진으로 알 수 없는 <span className="text-orange-600 font-semibold">가격·크기·소재·성능</span>은 추측 없이 <strong>‘확인 필요’</strong>로 명시
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong className="text-stone-800">연관 제품 2선 & 매칭 팁</strong>
              <p className="text-[11px] text-stone-500">
                함께 배치하면 시너지를 내는 어울리는 가구/소품 추천
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-semibold bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-200">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>왼쪽 샘플 가구를 클릭하면 1초 만에 테스트할 수 있습니다</span>
      </div>
    </div>
  );
};
