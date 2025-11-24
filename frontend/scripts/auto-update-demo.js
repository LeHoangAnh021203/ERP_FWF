#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lấy URL từ Vercel deployment
async function getLatestDeploymentUrl() {
  try {
    // Sử dụng Vercel CLI để lấy thông tin deployment
    const { execSync } = await import('child_process');
    const output = execSync('vercel ls --limit 1', { encoding: 'utf8' });
    
    // Parse output để lấy URL
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('https://') && line.includes('vercel.app')) {
        const match = line.match(/https:\/\/[^\s]+/);
        if (match) {
          return match[0];
        }
      }
    }
    
    // Fallback: lấy từ environment hoặc hardcode
    return process.env.VERCEL_URL || 'https://fb-network-demo-98730bell-hoanganhle0203-7387s-projects.vercel.app';
  } catch {
    console.log('⚠️  Không thể lấy URL từ Vercel, sử dụng URL mặc định');
    return 'https://fb-network-demo-98730bell-hoanganhle0203-7387s-projects.vercel.app';
  }
}

async function updateDemoLinks() {
  const newUrl = await getLatestDeploymentUrl();
  
  console.log(`🔄 Đang cập nhật link demo thành: ${newUrl}`);

  // Files cần cập nhật
  const filesToUpdate = [
    {
      path: '../scripts/demo-info.js',
      pattern: /console\.log\(chalk\.green\('   Production: '\) \+ chalk\.blue\.underline\('([^']+)'\)\);/,
      replacement: `console.log(chalk.green('   Production: ') + chalk.blue.underline('${newUrl}'));`
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
  console.log(`📝 Link demo mới: ${newUrl}`);
  
  return newUrl;
}

// Chạy script nếu được gọi trực tiếp
if (process.argv[1] && process.argv[1].includes('auto-update-demo.js')) {
  updateDemoLinks();
}

export { updateDemoLinks }; 