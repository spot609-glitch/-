import { SampleFurniture } from '../types';

export const SAMPLE_FURNITURE_LIST: SampleFurniture[] = [
  {
    id: 'sample-1',
    name: '내추럴 오크 원목 다이닝 테이블',
    category: '테이블 / 식탁',
    purpose: '신혼부부 20평대 거실 겸 다이닝룸, 따뜻하고 아늑한 대화 공간',
    tone: '다정하고 따뜻한 감성체',
    imageUrl:
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-2',
    name: '모듈형 웜그레이 패브릭 소파',
    category: '소파 / 거실가구',
    purpose: '30평대 아파트 거실 메인 릴랙스 공간 및 주말 가족 휴식',
    tone: '전문적이고 신뢰감 있는 컨설턴트체',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-3',
    name: '미드센추리 모던 가죽 라운지 체어',
    category: '1인 체어 / 암체어',
    purpose: '재택근무자를 위한 홈오피스 서재 독서 및 생각정리 코너',
    tone: '트렌디하고 세련된 라이프스타일체',
    imageUrl:
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-4',
    name: '미니멀 아치형 황동 플로어 스탠드 조명',
    category: '조명 / 인테리어 소품',
    purpose: '원룸 거실 코너 간접 조명 및 밤 시간 은은한 무드등 연출',
    tone: '담백하고 실용적인 요약체',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
];

export const QUICK_PURPOSE_TAGS = [
  '신혼부부 거실 휴식 & 대화 공간',
  '20평대 아파트 내추럴 다이닝룸',
  '재택근무자를 위한 집중형 홈오피스',
  '원룸 공간 효율 극대화 멀티존',
  '호텔식 감성의 미니멀 침실 힐링존',
  '카페 무드의 쇼룸 & 라운지 연출',
];

export const TONE_OPTIONS: Array<{
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
  example: string;
}> = [
  {
    id: '다정하고 따뜻한 감성체',
    name: '다정하고 따뜻한 감성체',
    shortLabel: '따뜻한 감성',
    badge: '추천',
    description: '고객의 라이프스타일에 공감하며 부드럽고 친근하게 다가가는 상담 톤',
    example: '“하루의 피로를 사르르 녹여줄, 고객님만의 따뜻한 보금자리를 만들어드릴게요.”',
  },
  {
    id: '전문적이고 신뢰감 있는 컨설턴트체',
    name: '전문적이고 신뢰감 있는 컨설턴트체',
    shortLabel: '전문가 신뢰',
    badge: '인테리어 디자이너',
    description: '공간의 비례, 조형미, 시각적 밸런스를 짚어주는 신뢰 중심 톤',
    example: '“공간의 동선과 시각적 개방감을 극대화하여 공간의 가치를 한 단계 높여줍니다.”',
  },
  {
    id: '트렌디하고 세련된 라이프스타일체',
    name: '트렌디하고 세련된 라이프스타일체',
    shortLabel: '트렌디 모던',
    badge: '매거진 감성',
    description: '감각적인 인테리어 무드와 미니멀한 감성을 전달하는 매거진 스타일 톤',
    example: '“어떤 각도에서 보아도 인스타그래머블한 무드를 연출하는 시그니처 아이템입니다.”',
  },
  {
    id: '담백하고 실용적인 요약체',
    name: '담백하고 실용적인 요약체',
    shortLabel: '실용 요약',
    badge: '직관적 안내',
    description: '군더더기 없이 공간 활용과 실질적인 배치 이점을 명쾌하게 전달하는 톤',
    example: '“공간 낭비 없이 콤팩트하게 배치 가능하며, 유지 관리가 용이한 구성입니다.”',
  },
];
