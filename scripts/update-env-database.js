// Script to guide updating DATABASE_URL in .env
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('=== DATABASE_URL Update Required ===\n');
console.log('Your .env file has an outdated MongoDB password.');
console.log('Current password in .env: 00ODe603Orvin6la');
console.log('Correct password: kevin123\n');
console.log('Please update your .env file with:');
console.log('DATABASE_URL=mongodb+srv://kipkoechkevin611_db_user:kevin123@cluster0.ghh0bgd.mongodb.net/majesty-compucare?retryWrites=true&w=majority&appName=Cluster0\n');
console.log('Also update NEXTAUTH_URL to remove port mismatch:');
console.log('NEXTAUTH_URL=http://localhost:3001');
console.log('Or remove NEXTAUTH_URL entirely for auto-detection\n');
