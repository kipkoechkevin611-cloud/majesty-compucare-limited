import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const defaultCategories = [
    { name: 'Laptops', description: 'Laptop computers and notebooks' },
    { name: 'Desktops', description: 'Desktop computers and towers' },
    { name: 'Printers', description: 'Printers and scanners' },
    { name: 'CCTV Systems', description: 'Security cameras and surveillance systems' },
    { name: 'Networking', description: 'Network equipment and accessories' },
    { name: 'Accessories', description: 'Computer accessories and peripherals' },
    { name: 'Software', description: 'Software and licenses' },
    { name: 'Electronics', description: 'Electronic devices and components' },
    { name: 'Other', description: 'Other products' },
  ]

  for (const category of defaultCategories) {
    const slug = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: category.name,
        slug,
        description: category.description,
      },
    })
  }

  console.log('Default categories seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
