/**
 * PWA 아이콘 생성 스크립트
 * sharp 라이브러리를 사용하여 SVG에서 다양한 크기의 PNG 생성
 * 
 * 사용법: npm install sharp && node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// SVG 템플릿 (동적 크기 지원)
function createSVG(size) {
  const radius = size * 0.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3182F6"/>
      <stop offset="100%" style="stop-color:#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#grad)"/>
  <g transform="translate(${size/2}, ${size * 0.48})">
    <!-- 문서 아이콘 -->
    <rect x="${-size * 0.2}" y="${-size * 0.25}" width="${size * 0.4}" height="${size * 0.5}" rx="${size * 0.03}" 
          fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="${size * 0.015}"/>
    <!-- 문서 라인들 -->
    <line x1="${-size * 0.13}" y1="${-size * 0.15}" x2="${size * 0.13}" y2="${-size * 0.15}" 
          stroke="white" stroke-width="${size * 0.012}" stroke-linecap="round"/>
    <line x1="${-size * 0.13}" y1="${-size * 0.07}" x2="${size * 0.13}" y2="${-size * 0.07}" 
          stroke="white" stroke-width="${size * 0.012}" stroke-linecap="round"/>
    <line x1="${-size * 0.13}" y1="${size * 0.01}" x2="${size * 0.05}" y2="${size * 0.01}" 
          stroke="white" stroke-width="${size * 0.012}" stroke-linecap="round"/>
    <!-- 펜 -->
    <g transform="translate(${size * 0.15}, ${size * 0.12}) rotate(-45)">
      <rect x="${-size * 0.03}" y="${-size * 0.18}" width="${size * 0.06}" height="${size * 0.15}" rx="${size * 0.01}" fill="white"/>
      <polygon points="${-size * 0.03},${-size * 0.03} 0,${size * 0.05} ${size * 0.03},${-size * 0.03}" fill="white"/>
    </g>
    <!-- 서명 -->
    <path d="M ${-size * 0.12} ${size * 0.16} Q ${-size * 0.04} ${size * 0.1} ${size * 0.04} ${size * 0.16} Q ${size * 0.1} ${size * 0.2} ${size * 0.16} ${size * 0.14}" 
          fill="none" stroke="white" stroke-width="${size * 0.015}" stroke-linecap="round"/>
  </g>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

async function main() {
  console.log('🎨 PWA 아이콘 생성 시작...\n');

  // sharp 확인
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('⚠️  sharp 패키지가 설치되어 있지 않습니다.');
    console.log('다음 명령어로 설치해주세요:\n');
    console.log('  npm install sharp\n');
    console.log('또는 브라우저에서 scripts/generate-icons.html 파일을 열어 수동으로 다운로드하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconDir, filename);
    
    try {
      const svg = createSVG(size);
      await sharp(Buffer.from(svg))
        .png()
        .toFile(filepath);
      console.log(`✅ ${filename} 생성 완료`);
    } catch (error) {
      console.error(`❌ ${filename} 생성 실패:`, error.message);
    }
  }

  console.log('\n🎉 아이콘 생성 완료!');
  console.log(`📁 저장 위치: ${iconDir}`);
}

main().catch(console.error);
