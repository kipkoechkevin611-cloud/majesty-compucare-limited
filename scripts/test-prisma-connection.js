// Prisma Connection Diagnostic Script
const { PrismaClient } = require('@prisma/client');

// Test with current .env credentials
const prisma = new PrismaClient();

async function diagnosePrisma() {
  try {
    console.log('=== Prisma Connection Diagnostic ===\n');

    console.log('1. Testing Prisma connection...');
    await prisma.$connect();
    console.log('✓ Prisma connection successful\n');

    console.log('2. Checking database info...');
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    console.log(`  Products: ${productCount}`);
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  Users: ${userCount}`);
    console.log(`  Orders: ${orderCount}\n`);

    console.log('3. Testing sample queries...');

    // Fetch categories
    const categories = await prisma.category.findMany({ take: 3 });
    console.log(`  Sample categories (${categories.length}):`);
    categories.forEach(cat => {
      console.log(`    - ${cat.name} (${cat.slug})`);
    });

    // Fetch products
    const products = await prisma.product.findMany({
      take: 3,
      include: { category: { select: { name: true } } }
    });
    console.log(`\n  Sample products (${products.length}):`);
    products.forEach(prod => {
      console.log(`    - ${prod.name} (KES ${prod.price}) - ${prod.category?.name || 'No category'}`);
    });

    console.log('\n✓ All queries successful');

  } catch (error) {
    console.error('✗ Prisma connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n=== Diagnostic Complete ===');
  }
}

diagnosePrisma();
