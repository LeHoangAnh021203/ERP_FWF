#!/usr/bin/env node

import chalk from 'chalk';

console.log('\n' + '='.repeat(60));
console.log(chalk.cyan.bold('🚀 FB Network CRM Dashboard'));
console.log('='.repeat(60));

console.log(chalk.yellow('\n📱 Demo Links:'));
console.log(chalk.green('   Production: ') + chalk.blue.underline('https://fb-network-demo-98730bell-hoanganhle0203-7387s-projects.vercel.app'));
console.log(chalk.green('   Local:      ') + chalk.blue.underline('http://localhost:3000'));

console.log(chalk.yellow('\n🔧 Available Commands:'));
console.log(chalk.green('   npm run dev    ') + chalk.white('- Start development server'));
console.log(chalk.green('   npm run build  ') + chalk.white('- Build for production'));
console.log(chalk.green('   npm run start  ') + chalk.white('- Start production server'));
console.log(chalk.green('   npm run lint   ') + chalk.white('- Run ESLint'));

console.log(chalk.yellow('\n📂 Project Structure:'));
console.log(chalk.white('   /src/app/        - Pages (Dashboard, Analytics, Calendar, etc.)'));
console.log(chalk.white('   /src/components/ - Reusable UI components'));
console.log(chalk.white('   /src/lib/        - Utilities and helpers'));

console.log(chalk.yellow('\n🎯 Features:'));
console.log(chalk.white('   ✅ Dashboard with analytics'));
console.log(chalk.white('   ✅ Customer management'));
console.log(chalk.white('   ✅ Order tracking'));
console.log(chalk.white('   ✅ Calendar & scheduling'));
console.log(chalk.white('   ✅ Reports & insights'));
console.log(chalk.white('   ✅ Responsive design'));

console.log('\n' + '='.repeat(60));
console.log(chalk.cyan('Happy coding! 🎉'));
console.log('='.repeat(60) + '\n'); 