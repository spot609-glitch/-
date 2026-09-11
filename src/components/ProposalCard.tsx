import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Layers,
  Copy,
  Check,
  Printer,
  Calendar,
  Share2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { ProposalCardResult } from '../types';

interface ProposalCardProps {
  proposal: ProposalCardResult;
  productImage: string | null;
  purpose: string;
  tone: string;
  onCopySuccess: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  productImage,
  purpose,
  tone,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCopyText = async () => {
    const formattedText = `[가구·인테리어 AI 제품 제안 카드]
■ 제안 제목: ${proposal.title}
■ 공간/목적: ${purpose || '고객 맞춤 공간'}
■ 상담 문체: ${tone}

[제품 소개]
${proposal.introduction}

[핵심 장점 3가지]
1. ${proposal.advantages[0] || ''}
2. ${proposal.advantages[1] || ''}
3. ${proposal.advantages[2] || ''}

[⚠️ 사진 외 추가 확인 정보 2가지 (확인 필요)]
1. [${proposal.verificationItems[0]?.category || '스펙'}] ${proposal.verificationItems[0]?.item || ''} (${proposal.verificationItems[0]?.status || '확인 필요'})
   - 안내: ${proposal.verificationItems[0]?.reason || ''}
2. [${proposal.verificationItems[1]?.category || '스펙'}] ${proposal.verificationItems[1]?.item || ''} (${proposal.verificationItems[1]?.status || '확인 필요'})
   - 안내: ${proposal.verificationItems[1]?.reason || ''}

[함께 추천하는 연관 제품 2선]
1. ${proposal.relatedProducts[0]?.name || ''} (${proposal.relatedProducts[0]?.category || '소품'})
   - 스타일링 팁: ${proposal.relatedProducts[0]?.matchTip || ''}
2. ${proposal.relatedProducts[1]?.name || ''} (${proposal.relatedProducts[1]?.category || '소품'})
   - 스타일링 팁: ${proposal.relatedProducts[1]?.matchTip || ''}
`;

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="proposal-card-result"
      className="bg-white rounded-2xl border-2 border-orange-200/90 shadow-md shadow-orange-500/5 overflow-hidden transition-all print:border-none print:shadow-none"
    >
      {proposal.isFallbackNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
            <span>AI 모델 트래픽 일시 지연으로 규격 표준 템플릿으로 안전하게 생성되었습니다.</span>
          </div>
        </div>
      )}

      {/* Consultation Card Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-bold text-[11px] tracking-wide uppercase">
              AI 제안 카드
            </span>
            <span className="text-stone-300">인테리어 컨설팅 리포트</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-300 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>{today}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {productImage && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-800 border-2 border-orange-400/40 shrink-0 shadow-sm">
              <img
                src={productImage}
                alt="제안 가구"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                {proposal.visualMood || '맞춤 스타일링'}
              </span>
              <span className="text-[11px] text-stone-400">
                문체: {tone}
              </span>
            </div>
            {/* 결과: 제목 */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {proposal.title}
            </h2>
            {purpose && (
              <p className="text-xs text-stone-300 flex items-center gap-1">
                <span className="text-orange-400">추천 공간:</span>
                <span className="truncate max-w-xs">{purpose}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-7">
        {/* 결과 1: 2~3문장 소개 */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>제품 소개 (Introduction)</span>
          </div>
          <div className="relative bg-orange-50/70 border-l-4 border-orange-500 rounded-r-xl p-4 sm:p-5 text-stone-800">
            <p className="text-sm sm:text-[15px] font-medium leading-relaxed">
              {proposal.introduction}
            </p>
          </div>
        </section>

        {/* 결과 2: 장점 3개 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>핵심 장점 3가지</span>
            </h3>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
              디자인 & 공간성 3선
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {proposal.advantages.slice(0, 3).map((advantage, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-orange-200 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {index + 1}
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  {advantage}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 결과 3: 추가 확인 정보 2개 (사진으로 확인할 수 없는 가격·크기·소재·성능은 ‘확인 필요’로 표시) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-stone-900">
                추가 확인 정보 2가지
              </h3>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              사진 외 스펙 확인 필요
            </span>
          </div>

          {/* 안내 배너 */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 flex items-start gap-2">
            <span className="text-orange-600 font-bold shrink-0 mt-0.5">※ 안내:</span>
            <p className="text-[11px] leading-relaxed">
              사진만으로는 확인할 수 없는 <strong>가격·실측 치수(크기)·내부 소재·내하중 및 성능</strong>은 임의로 추측하지 않고,
              고객 상담 및 공식 카탈로그를 통한 <strong>‘확인 필요’</strong> 항목으로 정확하게 구분하여 표기합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proposal.verificationItems.slice(0, 2).map((vItem, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border-2 border-orange-200 bg-orange-50/40 flex flex-col justify-between gap-2 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-stone-700 px-2 py-0.5 bg-white rounded border border-stone-200">
                      분류: {vItem.category}
                    </span>
                    <span className="text-xs font-extrabold text-orange-600 bg-white px-2 py-0.5 rounded-md border-2 border-orange-400 shadow-2xs">
                      [확인 필요]
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {vItem.item}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {vItem.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-orange-200/60 text-[11px] font-semibold text-orange-800 flex items-center justify-between">
                  <span>상담원 점검 필수</span>
                  <span className="underline decoration-orange-400">실측/스펙북 대조</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 결과 4: 연관 제품 2개 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>함께 코디할 연관 제품 2선</span>
            </h3>
            <span className="text-xs text-stone-500">
              인테리어 완성도를 높이는 매칭 추천
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proposal.relatedProducts.slice(0, 2).map((relProduct, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between gap-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                      추천 {index + 1} • {relProduct.category}
                    </span>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      매칭 아이템
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {relProduct.name}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {relProduct.matchTip}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[11px] text-orange-600 font-semibold gap-1">
                  <span>스타일링 시너지 효과</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        {proposal.suggestedTags && proposal.suggestedTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Tag className="w-3 h-3" /> 스타일 키워드:
            </span>
            {proposal.suggestedTags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}

        {/* Consultation Action Bar */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-copy-proposal"
              onClick={handleCopyText}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>제안문 전체 복사</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-print-proposal"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>인쇄 / PDF</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400">
            * 고객 상담 카카오톡, 문자, 견적서에 바로 붙여넣어 활용하세요.
          </span>
        </div>
      </div>
    </div>
  );
};
