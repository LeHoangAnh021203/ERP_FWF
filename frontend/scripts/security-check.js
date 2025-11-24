#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Security Check Starting...\n');

// Patterns to check for
const patterns = [
  {
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{48}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Stability AI API Key',
    pattern: /sk-[a-zA-Z0-9]{32,}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Replicate API Key',
    pattern: /r8_[a-zA-Z0-9]{32,}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Generic API Key',
    pattern: /api[_-]?key[_-]?[=:]\s*['"`][a-zA-Z0-9]{20,}['"`]/gi,
    severity: 'HIGH'
  },
  {
    name: 'Bearer Token',
    pattern: /bearer\s+[a-zA-Z0-9]{20,}/gi,
    severity: 'HIGH'
  },
  {
    name: 'Database URL',
    pattern: /mongodb[+srv]?:\/\/[^@\s]+@[^@\s]+\/[^@\s]+/gi,
    severity: 'HIGH'
  },
  {
    name: 'JWT Secret',
    pattern: /jwt[_-]?secret[_-]?[=:]\s*['"`][a-zA-Z0-9]{20,}['"`]/gi,
    severity: 'HIGH'
  }
];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel'
];

// File extensions to check
const includeExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.txt',
  '.env',
  '.env.local',
  '.env.example'
];

let issuesFound = 0;

function shouldExcludeDir(dirName) {
  return excludeDirs.includes(dirName);
}

function shouldIncludeFile(fileName) {
  const ext = path.extname(fileName);
  return includeExtensions.includes(ext);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    patterns.forEach(({ name, pattern, severity }) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`❌ ${severity}: ${name} found in ${relativePath}`);
        matches.forEach((match, index) => {
          // Mask the key for security
          const masked = match.length > 10 
            ? match.substring(0, 4) + '...' + match.substring(match.length - 4)
            : '***';
          console.log(`   Match ${index + 1}: ${masked}`);
        });
        issuesFound++;
      }
    });
  } catch (error) {
    console.log(`⚠️  Could not read file: ${filePath}`);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeDir(item)) {
          scanDirectory(fullPath);
        }
      } else if (shouldIncludeFile(item)) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.log(`⚠️  Could not scan directory: ${dirPath}`);
  }
}

// Check for .env files in git history
function checkGitHistory() {
  console.log('\n🔍 Checking Git history for .env files...');
  
  const { execSync } = require('child_process');
  try {
    const result = execSync('git log --all --full-history -- .env*', { encoding: 'utf8' });
    if (result.trim()) {
      console.log('❌ CRITICAL: .env files found in git history!');
      console.log('   Run: git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env*" --prune-empty --tag-name-filter cat -- --all');
      issuesFound++;
    } else {
      console.log('✅ No .env files in git history');
    }
  } catch (error) {
    console.log('⚠️  Could not check git history (not a git repo or no .env files)');
  }
}

// Check .gitignore
function checkGitignore() {
  console.log('\n🔍 Checking .gitignore configuration...');
  
  try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const envPatterns = ['.env', '.env.local', '.env.production'];
    
    envPatterns.forEach(pattern => {
      if (gitignore.includes(pattern)) {
        console.log(`✅ ${pattern} is in .gitignore`);
      } else {
        console.log(`❌ HIGH: ${pattern} is NOT in .gitignore`);
        issuesFound++;
      }
    });
  } catch (error) {
    console.log('❌ CRITICAL: No .gitignore file found');
    issuesFound++;
  }
}

// Main execution
console.log('📁 Scanning source code for sensitive data...\n');
scanDirectory('app');

console.log('\n📁 Scanning root directory...\n');
scanDirectory('.');

checkGitHistory();
checkGitignore();

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SECURITY CHECK SUMMARY');
console.log('='.repeat(50));

if (issuesFound === 0) {
  console.log('✅ No security issues found!');
  console.log('🎉 Your codebase appears to be secure.');
} else {
  console.log(`❌ Found ${issuesFound} security issue(s)`);
  console.log('🚨 Please fix these issues before deploying!');
  process.exit(1);
}

console.log('\n💡 Security Tips:');
console.log('   - Use environment variables for all API keys');
console.log('   - Never commit .env files to git');
console.log('   - Use server-side API routes for sensitive operations');
console.log('   - Regularly rotate your API keys');
console.log('   - Monitor your API usage for suspicious activity');
