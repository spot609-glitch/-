import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ProposalCard } from './components/ProposalCard';
import { EmptyResult } from './components/EmptyResult';
import { GuideModal } from './components/GuideModal';
import { Toast } from './components/Toast';
import { ProposalCardResult, SampleFurniture, ToneType } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [purpose, setPurpose] = useState<string>('신혼부부 20평대 거실 휴식 및 대화 공간');
  const [selectedTone, setSelectedTone] = useState<ToneType>('다정하고 따뜻한 감성체');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalCardResult | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleImageChange = (image: string | null, mimeType?: string) => {
    setCurrentImage(image);
    if (mimeType) setImageMimeType(mimeType);
    setError(null);
  };

  const handleSelectSample = (sample: SampleFurniture) => {
    setCurrentImage(sample.imageUrl);
    setImageMimeType('image/jpeg');
    setPurpose(sample.purpose);
    setSelectedTone(sample.tone as ToneType);
    setError(null);
    showToast(`샘플 가구 '${sample.name}'가 선택되었습니다.`);
  };

  const handleGenerateProposal = async () => {
    if (!currentImage) {
      setError('제품 이미지를 먼저 업로드하거나 샘플 가구를 선택해 주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: currentImage,
          mimeType: imageMimeType,
          purpose,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `서버 오류가 발생했습니다 (${response.status})`
        );
      }

      const data: ProposalCardResult = await response.json();
      setProposal(data);
      showToast('AI 제품 제안 카드가 성공적으로 생성되었습니다!');

      // On mobile / tablet, smoothly scroll down to the result card
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          resultContainerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 150);
      }
    } catch (err: any) {
      console.error('Error in handleGenerateProposal:', err);
      let errMsg = err.message || '';
      if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand')) {
        errMsg = '현재 AI 모델 접속량이 급증하여 일시적인 지연이 발생했습니다. [다시 시도하기]를 눌러주세요.';
      } else if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        errMsg = '네트워크 연결이 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해 주세요.';
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Top Header */}
      <Header onShowGuide={() => setIsGuideOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Alert if any with Retry Button */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-300 text-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5 text-stone-900">제안문 생성 안내</strong>
                <p className="text-stone-700">{error}</p>
              </div>
            </div>
            <button
              type="button"
              id="btn-retry-proposal"
              onClick={handleGenerateProposal}
              disabled={isLoading}
              className="shrink-0 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              다시 시도하기
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout: PC (Left Input, Right Result) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* PC Left Column: Input Form (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-5 no-print">
            <InputForm
              currentImage={currentImage}
              onImageChange={handleImageChange}
              onSelectSample={handleSelectSample}
              purpose={purpose}
              onPurposeChange={setPurpose}
              selectedTone={selectedTone}
              onSelectTone={setSelectedTone}
              onSubmit={handleGenerateProposal}
              isLoading={isLoading}
            />
          </div>

          {/* PC Right Column: Result Section (7 cols on lg) */}
          <div
            ref={resultContainerRef}
            className="lg:col-span-7 xl:col-span-7 scroll-mt-20"
          >
            {proposal ? (
              <ProposalCard
                proposal={proposal}
                productImage={currentImage}
                purpose={purpose}
                tone={selectedTone}
                onCopySuccess={() => showToast('상담용 제안문 전체가 클립보드에 복사되었습니다!')}
              />
            ) : (
              <EmptyResult />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-50/70 py-6 text-center text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <strong className="text-stone-700">AI 제품 제안 카드</strong> • 가구·인테리어 상담 전문 솔루션
          </p>
          <p className="text-stone-400 text-[11px]">
            * 사진으로 확인할 수 없는 가격·크기·소재·성능은 ‘확인 필요’로 표기됩니다.
          </p>
        </div>
      </footer>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
      />
    </div>
  );
}
