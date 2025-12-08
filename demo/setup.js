import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 EasyScheduler Demo Setup\n');

// Create database directory
const dbDir = path.join(__dirname, 'backend', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Created database directory');
}

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `JWT_SECRET=demo-secret-key-change-in-production
DB_PATH=./database/demo.db
PORT=5001
NODE_ENV=development
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:5173/#/admin');
console.log('3. Create your admin account');
console.log('4. Configure the application');
console.log('5. Create readonly demo user');
console.log('6. Remove full admin, keep only demo user');
console.log('7. Build and deploy to GitHub Pages\n');
