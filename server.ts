import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Parse large payloads for base64 images
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Helper to convert URL to base64 if user picked a sample image URL
async function resolveImagePart(imageSource: string, inputMime?: string) {
  if (imageSource.startsWith('data:')) {
    const matches = imageSource.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      };
    }
  }

  // If already pure base64
  if (!imageSource.startsWith('http://') && !imageSource.startsWith('https://')) {
    return {
      inlineData: {
        mimeType: inputMime || 'image/jpeg',
        data: imageSource,
      },
    };
  }

  // If HTTP/HTTPS URL (e.g. sample preset) with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(imageSource, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const detectedMime =
      response.headers.get('content-type') || inputMime || 'image/jpeg';

    return {
      inlineData: {
        mimeType: detectedMime.split(';')[0].trim(),
        data: buffer.toString('base64'),
      },
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(`이미지 로드 실패: ${err.message || '네트워크 응답 없음'}`);
  }
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

app.post('/api/generate-proposal', async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, mimeType, purpose, tone } = req.body;

    if (!image) {
      res.status(400).json({ error: '제품 이미지가 필요합니다.' });
      return;
    }

    const resolvedPurpose = purpose?.trim() || '고객의 라이프스타일에 어울리는 인테리어 공간';
    const resolvedTone = tone?.trim() || '다정하고 따뜻한 감성체';

    const ai = getGenAI();
    const imagePart = await resolveImagePart(image, mimeType);

    const promptText = `
[역할]
당신은 가구 및 홈스타일링 전문 인테리어 상담 컨설턴트입니다.
고객과의 1:1 상담에서 즉시 전달할 수 있는 매력적이고 완성도 높은 'AI 제품 제안 카드'를 작성하십시오.

[입력 정보]
- 첨부된 이미지: 고객이 문의하거나 추천할 가구/소품 제품 사진
- 사용할 장소나 목적: "${resolvedPurpose}"
- 제안 문체: "${resolvedTone}"

[엄격한 제약조건 및 작성 가이드]
1. **사진으로 확인할 수 없는 스펙 (가격, 정확한 크기/치수, 내부 자재/원목 수종/충전재, 내하중/기능성)**:
   - 절대로 추측하거나 임의의 숫자를 지어내지 마십시오.
   - '추가 확인 정보(verificationItems)' 2개 항목으로 명확하게 배정하고, 반드시 '확인 필요' 상태를 표시해야 합니다.
2. **소개글(introduction)**:
   - 반드시 2~3개의 완성된 문장으로 작성하십시오.
   - 요청된 문체("${resolvedTone}")의 톤앤매너를 자연스럽고 품격 있게 살려 고객의 마음을 사로잡도록 작성하십시오.
3. **장점(advantages)**:
   - 사진을 통해 시각적으로 뚜렷하게 관찰되는 디자인 미학, 조형적 실루엣, 공간 연출 효과, 색감 조화 등을 바탕으로 핵심 장점 정확히 3개를 구체적으로 제시하십시오.
4. **추가 확인 정보(verificationItems)**:
   - 사진만으로는 확인이 불가능하여 실제 매장/제조사/카탈로그를 통해 상담 시 고객과 함께 점검해야 할 핵심 2개 항목을 선정하십시오.
   - 예: 가격 및 프로모션 할인, 실측 가로x세로x높이 및 공간 여유 치수, 내부 마감재 및 친환경 등급, 허용 하중 및 오염 방지 가공 여부 등.
   - status는 반드시 "확인 필요"여야 합니다.
5. **연관 제품(relatedProducts)**:
   - 해당 제품과 공간("${resolvedPurpose}")에서 함께 배치했을 때 인테리어 완성도와 실용성을 극대화할 수 있는 연관 가구 또는 인테리어 소품 정확히 2개를 추천하고, 함께 매치하는 스타일링 팁을 1~2문장으로 제공하십시오.
6. 언어는 자연스럽고 세련된 한국어로 작성하십시오.
`;

    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    let textOutput: string | null = null;
    let lastError: any = null;

    const baseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: '제안 카드 제목 (예: 감성적인 무드를 완성하는 내추럴 원목 다이닝 테이블)',
        },
        introduction: {
          type: Type.STRING,
          description: '선택한 제안 문체로 작성된 2~3문장의 고객 맞춤 소개글',
        },
        advantages: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '사진에서 관찰되는 디자인과 공간적 가치를 담은 장점 정확히 3개',
        },
        verificationItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: {
                type: Type.STRING,
                description: '확인 필요 항목 명칭 (예: 상세 실측 치수 및 배치 공간 여유)',
              },
              category: {
                type: Type.STRING,
                description: '가격 | 크기 | 소재 | 성능 | 기타 중 하나',
              },
              reason: {
                type: Type.STRING,
                description: '사진상 확인이 불가하여 고객 상담 및 현장 실측 시 확인이 필요한 구체적 사유',
              },
              status: {
                type: Type.STRING,
                description: '반드시 "확인 필요"',
              },
            },
            required: ['item', 'category', 'reason', 'status'],
          },
          description: '사진으로 확인 불가능하여 추가 확인이 필수적인 스펙 정보 2개',
        },
        relatedProducts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: '추천 연관 제품명 (예: 웜톤 린넨 식탁 매트 및 세라믹 화병)',
              },
              category: {
                type: Type.STRING,
                description: '소품/체어/조명/러그 등의 분류',
              },
              matchTip: {
                type: Type.STRING,
                description: '제안 제품과 함께 매치했을 때의 시너지 및 인테리어 연출 팁',
              },
            },
            required: ['name', 'category', 'matchTip'],
          },
          description: '함께 코디하면 좋은 연관 제품 정확히 2개',
        },
        visualMood: {
          type: Type.STRING,
          description: '사진에서 감지된 인테리어 스타일/무드 키워드 (예: 내추럴 웜 미니멀리즘)',
        },
        suggestedTags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '관련 해시태그 3~4개',
        },
      },
      required: [
        'title',
        'introduction',
        'advantages',
        'verificationItems',
        'relatedProducts',
      ],
    };

    for (const modelName of candidateModels) {
      try {
        const config: any = {
          systemInstruction:
            '당신은 가구 및 인테리어 상담 전문 컨설턴트입니다. 사진으로 파악할 수 없는 가격, 치수, 내부 소재, 성능은 결코 추측하지 않고 고객 확인 필요 항목으로 분류합니다. 세련되고 정제된 상담 제안 카드를 구조화된 JSON으로 반환합니다.',
          responseMimeType: 'application/json',
          responseSchema: baseSchema,
        };

        // For Gemini 3.8 Flash, set low thinking level to reduce latency and avoid timeouts
        if (modelName === 'gemini-3.8-flash') {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              imagePart,
              {
                text: promptText,
              },
            ],
          },
          config,
        });

        if (response.text) {
          textOutput = response.text;
          console.log(`Successfully generated proposal using ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} encountered an error:`, err?.message || err);
        // Wait a short delay before trying the next model
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    let proposalData: any = null;

    if (textOutput) {
      try {
        proposalData = JSON.parse(textOutput);
      } catch (parseErr) {
        console.error('Failed to parse model JSON:', parseErr);
      }
    }

    // If all models failed or parsing failed due to severe 503 traffic spike
    if (!proposalData) {
      console.warn('Using robust fallback proposal due to temporary model unavailability:', lastError?.message);
      
      const toneIntroductions: Record<string, string> = {
        '다정하고 따뜻한 감성체': `고객님의 소중한 일상에 따스한 온기와 편안함을 더해줄 맞춤 가구 제안입니다. ${resolvedPurpose}에 자연스럽게 녹아들어 머무는 매 순간 아늑한 쉼을 선사합니다. 함께하는 시간마다 포근한 감성을 채워보세요.`,
        '전문적이고 신뢰감 있는 컨설턴트체': `해당 공간(${resolvedPurpose})의 동선과 시각적 비례감을 극대화하도록 정밀하게 설계된 스타일링 제안입니다. 세련된 조형미와 뛰어난 공간 친화력으로 인테리어의 완성도를 격조 높게 끌어올립니다. 품격 있는 공간 연출을 위한 최적의 솔루션입니다.`,
        '트렌디하고 세련된 라이프스타일체': `감각적인 실루엣과 모던한 감성이 어우러져 공간의 아이덴티티를 뚜렷하게 살려주는 시그니처 아이템입니다. ${resolvedPurpose}에 감도 높은 무드를 더해 어떤 각도에서도 감각적인 뷰를 완성합니다. 트렌디한 라이프스타일을 위한 매력적인 선택입니다.`,
        '담백하고 실용적인 요약체': `${resolvedPurpose}의 공간 효율과 실용적인 배치를 최우선으로 고려한 가구 제안입니다. 군더더기 없는 디자인으로 유지 관리가 용이하며 다른 인테리어 요소와도 매끄럽게 조화됩니다. 일상의 편리함과 안정적인 만족감을 동시에 제공합니다.`,
      };

      const introText =
        toneIntroductions[resolvedTone] ||
        `고객님의 ${resolvedPurpose}에 가장 자연스럽게 어울리는 가구 제안입니다. 세련된 디자인과 공간 친화적인 비례감으로 편안하고 조화로운 인테리어를 완성합니다.`;

      proposalData = {
        title: `${resolvedPurpose.split(',')[0].slice(0, 18)}을 위한 감각적인 맞춤 가구 제안`,
        introduction: introText,
        advantages: [
          '공간의 전체적인 톤앤매너와 부드럽게 어우러지는 조형적 디자인',
          '시각적인 답답함 없이 공간에 개방감과 아늑한 깊이를 더하는 비례감',
          '일상 속 편안한 쉼과 실용성을 동시에 만족시키는 감각적인 실루엣',
        ],
        verificationItems: [
          {
            item: '상세 실측 규격 및 설치 공간 여유 치수',
            category: '크기',
            reason: '사진 판독이 불가하므로 가구 배치 시 동선(최소 60~80cm) 및 출입문 반경 실측 확인이 필요합니다.',
            status: '확인 필요',
          },
          {
            item: '최종 판매 가격 및 옵션별 프로모션 혜택',
            category: '가격',
            reason: '소재 옵션 및 배송·설치비 포함 여부 등 정확한 최종 견적 확인이 필요합니다.',
            status: '확인 필요',
          },
        ],
        relatedProducts: [
          {
            name: '소프트 텍스처 웜그레이 러그',
            category: '패브릭/러그',
            matchTip: '바닥면과의 경계를 부드럽게 완화하여 제품 주변에 시각적 안정감과 포근한 텍스처를 더해줍니다.',
          },
          {
            name: '미니멀 간접 플로어 스탠드 조명',
            category: '조명',
            matchTip: '은은한 간접 조도를 형성하여 가구의 입체감과 저녁 시간대 아늑한 힐링 무드를 극대화합니다.',
          },
        ],
        visualMood: '내추럴 웜 모던',
        suggestedTags: ['공간스타일링', '감성인테리어', '맞춤가구', '홈스타일링'],
        isFallbackNotice: true,
      };
    }

    // Validate structure and ensure exactly 3 advantages, 2 verification items, 2 related products
    if (!Array.isArray(proposalData.advantages) || proposalData.advantages.length < 3) {
      proposalData.advantages = [
        proposalData.advantages?.[0] || '공간의 분위기를 한층 따뜻하고 감각적으로 살려주는 조형적 디자인',
        proposalData.advantages?.[1] || '어느 각도에서 보아도 자연스럽게 시선을 사로잡는 마감 실루엣',
        proposalData.advantages?.[2] || '일상의 휴식과 대화에 편안함을 더해주는 실용적 비례감',
      ].slice(0, 3);
    } else {
      proposalData.advantages = proposalData.advantages.slice(0, 3);
    }

    if (!Array.isArray(proposalData.verificationItems) || proposalData.verificationItems.length < 2) {
      proposalData.verificationItems = [
        {
          item: '실측 규격 및 설치 공간 여유 치수',
          category: '크기',
          reason: '가구 배치 시 통로 동선(최소 60~80cm) 및 천장고에 따른 실측 확인이 필요합니다.',
          status: '확인 필요',
        },
        {
          item: '정확한 판매 가격 및 프로모션 옵션',
          category: '가격',
          reason: '사진상 옵션별(소재/컬러/배송비) 최종 견적 확인이 필요합니다.',
          status: '확인 필요',
        },
      ];
    } else {
      proposalData.verificationItems = proposalData.verificationItems.slice(0, 2).map((item: any) => ({
        ...item,
        status: '확인 필요',
      }));
    }

    if (!Array.isArray(proposalData.relatedProducts) || proposalData.relatedProducts.length < 2) {
      proposalData.relatedProducts = [
        {
          name: '소프트 텍스처 웜그레이 러그',
          category: '패브릭/러그',
          matchTip: '바닥면과의 대비를 부드럽게 완화하여 공간에 안정감과 포근한 텍스처를 더해줍니다.',
        },
        {
          name: '미니멀 간접 스탠드 조명',
          category: '조명',
          matchTip: '제품 주변에 부드러운 그림자를 만들어 인테리어의 깊이감과 야간 무드를 극대화합니다.',
        },
      ];
    } else {
      proposalData.relatedProducts = proposalData.relatedProducts.slice(0, 2);
    }

    res.json(proposalData);
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    let friendlyMessage = 'AI 제안문 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    const rawMsg = String(error?.message || '');
    if (rawMsg.includes('503') || rawMsg.includes('UNAVAILABLE') || rawMsg.includes('high demand')) {
      friendlyMessage = '현재 AI 모델 접속량이 급증하여 일시적인 지연이 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
      friendlyMessage = '요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (rawMsg.includes('API_KEY')) {
      friendlyMessage = 'Gemini API 키 설정을 확인해 주세요.';
    }
    res.status(500).json({
      error: friendlyMessage,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
