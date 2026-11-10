// Helper script to detect and set the correct NEXTAUTH_URL for local development
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// Read current .env
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if NEXTAUTH_URL is set to localhost:3000
if (envContent.includes('NEXTAUTH_URL=http://localhost:3000')) {
  console.log('⚠️  NEXTAUTH_URL is hardcoded to port 3000');
  console.log('💡 For local development, it should match your actual dev server port');
  console.log('');
  console.log('Please update your .env file to:');
  console.log('  NEXTAUTH_URL=http://localhost:3001');
  console.log('');
  console.log('Or remove NEXTAUTH_URL entirely (NextAuth will auto-detect with trustHost: true)');
} else {
  console.log('✓ NEXTAUTH_URL configuration looks OK');
}
