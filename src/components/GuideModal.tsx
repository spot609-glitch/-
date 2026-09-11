import React from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              가구·인테리어 AI 제품 제안 카드 가이드
            </h3>
            <p className="text-xs text-stone-500">
              성공적인 고객 상담을 위한 핵심 체크포인트
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
            <h4 className="font-bold text-orange-900 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              스펙 정보 왜곡 방지 원칙 (‘확인 필요’)
            </h4>
            <p className="text-xs text-orange-800">
              인테리어 상담에서 사진만으로 크기나 가격, 소재를 섣불리 단정하면 고객 신뢰가 하락할 수 있습니다. 본 시스템은 사진으로 확인할 수 없는 <strong>가격·실측 치수·내부 소재·내구성</strong>에 대해 임의 추측을 배제하고 정확히 <strong>‘확인 필요’</strong>로 분류합니다.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              효과적인 제안 카드 활용법
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-1">
              <li><strong>사진 1장:</strong> 제품의 형태와 질감이 선명한 사진을 사용하세요.</li>
              <li><strong>공간과 목적:</strong> 고객의 평형대(예: 25평 아파트)나 주 사용 목적(예: 서재, 휴식)을 적을수록 소개글이 더욱 구체화됩니다.</li>
              <li><strong>문체 변경:</strong> 고객의 연령대와 선호 분위기에 맞춰 감성체, 전문가체, 라이프스타일체 등을 번갈아 생성해 보세요.</li>
              <li><strong>원클릭 복사:</strong> 생성된 카드는 [제안문 전체 복사] 버튼으로 카카오톡이나 문자메시지에 즉시 붙여넣을 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
