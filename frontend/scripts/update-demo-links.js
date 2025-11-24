#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy URL từ command line argument hoặc environment variable
const newUrl = process.argv[2] || process.env.VERCEL_URL;

if (!newUrl) {
  console.log('❌ Không có URL mới. Sử dụng: node scripts/update-demo-links.js <URL>');
  console.log('Hoặc set VERCEL_URL environment variable');
  process.exit(1);
}

const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;

console.log(`🔄 Đang cập nhật link demo thành: ${fullUrl}`);

// Files cần cập nhật
const filesToUpdate = [
  {
    path: '../scripts/demo-info.js',
    pattern: /console\.log\(chalk\.green\('   Production: '\) \+ chalk\.blue\.underline\('([^']+)'\)\);/,
    replacement: `console.log(chalk.green('   Production: ') + chalk.blue.underline('${fullUrl}'));`
  },
  {
    path: '../src/components/header.tsx',
    pattern: /const demoUrl = "([^"]+)"/,
    replacement: `const demoUrl = "${fullUrl}"`
  }
];

let updatedCount = 0;

filesToUpdate.forEach(({ path: filePath, pattern, replacement }) => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Đã cập nhật: ${filePath}`);
      updatedCount++;
    } else {
      console.log(`⚠️  Không tìm thấy pattern trong: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Lỗi khi cập nhật ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updatedCount} file(s)`);
console.log(`📝 Link demo mới: ${fullUrl}`); 