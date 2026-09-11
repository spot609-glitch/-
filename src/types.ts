export interface VerificationItem {
  item: string;
  reason: string;
  category: '가격' | '크기' | '소재' | '성능' | '기타';
  status: '확인 필요';
}

export interface RelatedProduct {
  name: string;
  category: string;
  matchTip: string;
}

export interface ProposalCardResult {
  title: string;
  introduction: string;
  advantages: string[];
  verificationItems: VerificationItem[];
  relatedProducts: RelatedProduct[];
  visualMood?: string;
  suggestedTags?: string[];
  isFallbackNotice?: boolean;
}

export interface SampleFurniture {
  id: string;
  name: string;
  category: string;
  purpose: string;
  tone: string;
  imageUrl: string;
}

export type ToneType =
  | '다정하고 따뜻한 감성체'
  | '전문적이고 신뢰감 있는 컨설턴트체'
  | '트렌디하고 세련된 라이프스타일체'
  | '담백하고 실용적인 요약체';
