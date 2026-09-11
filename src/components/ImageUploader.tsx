import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SAMPLE_FURNITURE_LIST } from '../data/samples';
import { SampleFurniture } from '../types';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageChange: (image: string | null, mimeType?: string) => void;
  onSelectSample: (sample: SampleFurniture) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('파일 크기는 최대 20MB까지 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Optimize resolution to max 1280px to ensure fast transmission and low Gemini latency
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            onImageChange(optimizedDataUrl, 'image/jpeg');
            return;
          }
        } catch {
          // Fallback to raw data url if canvas security or memory exception occurs
        }
        onImageChange(rawDataUrl, file.type);
      };
      img.onerror = () => {
        onImageChange(rawDataUrl, file.type);
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => {
      setErrorMsg('이미지를 읽는 도중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <span>1. 제품 이미지 1장</span>
          <span className="text-orange-600 font-normal text-xs">*필수</span>
        </label>
        {currentImage && (
          <button
            type="button"
            onClick={() => {
              onImageChange(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-xs text-stone-700 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>이미지 삭제</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id="product-image-input"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInput}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-orange-300 bg-stone-50 aspect-video sm:aspect-[16/10] flex items-center justify-center shadow-sm">
          <img
            src={currentImage}
            alt="업로드된 가구 제품"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              id="btn-replace-image"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-semibold shadow hover:bg-orange-50 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
              사진 변경
            </button>
          </div>
          <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-orange-400" />
            이미지 선택 완료
          </div>
        </div>
      ) : (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-orange-500 bg-orange-50/80 scale-[1.01]'
              : 'border-stone-300 hover:border-orange-400 hover:bg-orange-50/30 bg-stone-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              가구 또는 인테리어 사진 클릭하거나 드래그
            </p>
            <p className="text-xs text-stone-700 mt-0.5">
              JPG, PNG, WebP 지원 (최대 15MB)
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            <ImageIcon className="w-3.5 h-3.5" />
            내 기기에서 사진 찾기
          </span>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
      )}

      {/* Preset sample furniture */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-stone-500">
            또는 추천 샘플 가구로 즉시 테스트:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_FURNITURE_LIST.map((sample) => (
            <button
              key={sample.id}
              type="button"
              id={`btn-sample-${sample.id}`}
              onClick={() => onSelectSample(sample)}
              className="group text-left p-1.5 rounded-lg border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 bg-white transition-all flex flex-col gap-1.5 shadow-2xs"
            >
              <div className="aspect-square w-full rounded-md overflow-hidden bg-stone-100 relative">
                <img
                  src={sample.imageUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 text-[9px] bg-stone-900/75 text-white px-1.5 py-0.5 rounded font-medium">
                  {sample.category.split('/')[0].trim()}
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-800 line-clamp-1 group-hover:text-orange-600">
                {sample.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
