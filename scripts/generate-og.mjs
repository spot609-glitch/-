import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOgImage() {
  const inputImage = path.resolve(process.cwd(), './src/assets/images/og_preview_image_1789093434116.jpg');
  const outputPath = path.resolve(process.cwd(), './public/og-image.jpg');

  // Resize base image to 1200x630
  const bg = await sharp(inputImage)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overlayGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#18181b" stop-opacity="0.94"/>
          <stop offset="42%" stop-color="#18181b" stop-opacity="0.82"/>
          <stop offset="75%" stop-color="#18181b" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#18181b" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#f97316"/>
        </linearGradient>
      </defs>

      <!-- Gradient overlay for maximum text legibility -->
      <rect width="1200" height="630" fill="url(#overlayGrad)"/>

      <!-- Accent Top Border -->
      <rect x="0" y="0" width="1200" height="6" fill="url(#orangeGrad)"/>

      <!-- Content group -->
      <g transform="translate(80, 100)">
        <!-- Top Tag Pill -->
        <rect width="216" height="38" rx="19" fill="#ea580c"/>
        <text x="108" y="24" font-family="'Pretendard', -apple-system, sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">가구 · 인테리어 맞춤 상담</text>

        <!-- Main Heading -->
        <text x="0" y="115" font-family="'Pretendard', -apple-system, sans-serif" font-size="58" font-weight="800" fill="#ffffff">AI 제품 제안 카드</text>

        <!-- Subtitle -->
        <text x="0" y="172" font-family="'Pretendard', -apple-system, sans-serif" font-size="24" font-weight="500" fill="#fed7aa">사진 1장과 공간 목적으로 완성하는 스마트 상담 솔루션</text>

        <!-- 3 Key Features -->
        <g transform="translate(0, 230)">
          <!-- Box 1 -->
          <rect x="0" y="0" width="200" height="82" rx="14" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5"/>
          <circle cx="32" cy="41" r="15" fill="#ea580c"/>
          <text x="32" y="47" font-family="'Pretendard', -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text>
          <text x="60" y="36" font-family="'Pretendard', -apple-system, sans-serif" font-size="15" font-weight="700" fill="#ffffff">제품 사진 업로드</text>
          <text x="60" y="58" font-family="'Pretendard', -apple-system, sans-serif" font-size="13" fill="#a8a29e">시각적 특성 자동 분석</text>

          <!-- Box 2 -->
          <rect x="220" y="0" width="200" height="82" rx="14" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5"/>
          <circle cx="252" cy="41" r="15" fill="#ea580c"/>
          <text x="252" y="47" font-family="'Pretendard', -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">2</text>
          <text x="280" y="36" font-family="'Pretendard', -apple-system, sans-serif" font-size="15" font-weight="700" fill="#ffffff">공간 목적 &amp; 문체</text>
          <text x="280" y="58" font-family="'Pretendard', -apple-system, sans-serif" font-size="13" fill="#a8a29e">맞춤 톤앤매너 설정</text>

          <!-- Box 3 -->
          <rect x="440" y="0" width="210" height="82" rx="14" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5"/>
          <circle cx="472" cy="41" r="15" fill="#ea580c"/>
          <text x="472" y="47" font-family="'Pretendard', -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
          <text x="500" y="36" font-family="'Pretendard', -apple-system, sans-serif" font-size="15" font-weight="700" fill="#ffffff">5단 제안 카드 완성</text>
          <text x="500" y="58" font-family="'Pretendard', -apple-system, sans-serif" font-size="13" fill="#a8a29e">소개·장점·확인필요·연관</text>
        </g>

        <!-- Trust Note -->
        <g transform="translate(0, 360)">
          <rect width="18" height="18" rx="9" fill="#f97316" fill-opacity="0.2"/>
          <text x="9" y="14" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f97316" text-anchor="middle">✓</text>
          <text x="28" y="15" font-family="'Pretendard', -apple-system, sans-serif" font-size="16" font-weight="500" fill="#d6d3d1">미확인 스펙은 명확한 '확인 필요' 표시로 신뢰도 높은 상담 지원</text>
        </g>
      </g>
    </svg>
  `);

  await sharp(bg)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPath);

  console.log(`Generated 1200x630 OG image at ${outputPath}`);
}

generateOgImage().catch(console.error);
