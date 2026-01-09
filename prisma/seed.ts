import { PrismaClient, UserRole, QuoteStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const counties = [
  'Dublin',
  'Cork',
  'Galway',
  'Limerick',
  'Kildare',
  'Meath',
  'Wexford',
  'Waterford',
  'Kilkenny',
  'Wicklow',
];

const categories = [
  { name: 'Plumbers', slug: 'plumbers', description: 'Emergency and routine plumbing services.' },
  { name: 'Electricians', slug: 'electricians', description: 'Electrical installations and repairs.' },
  { name: 'Contractors', slug: 'contractors', description: 'General contracting and renovations.' },
  { name: 'Attic Renovators', slug: 'attic-renovators', description: 'Attic conversions and upgrades.' },
  { name: 'Roofers', slug: 'roofers', description: 'Roof inspections and repairs.' },
  { name: 'Painters', slug: 'painters', description: 'Interior and exterior painting.' },
  { name: 'Landscapers', slug: 'landscapers', description: 'Garden and outdoor maintenance.' },
  { name: 'Carpenters', slug: 'carpenters', description: 'Custom woodwork and fittings.' },
  { name: 'Heating Specialists', slug: 'heating-specialists', description: 'Boilers and heating systems.' },
  { name: 'Cleaners', slug: 'cleaners', description: 'Deep cleaning and end of tenancy.' },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.quoteThread.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.providerPhoto.deleteMany();
  await prisma.coverageArea.deleteMany();
  await prisma.providerCategory.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@homehub.ie',
      name: 'HomeHub Admin',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const categoryRecords = await prisma.category.createMany({
    data: categories,
  });

  const categoryList = await prisma.category.findMany();

  const providerUsers = [] as { id: string; email: string }[];
  for (let i = 0; i < 60; i += 1) {
    const passwordHash = await bcrypt.hash('Provider123!', 10);
    const user = await prisma.user.create({
      data: {
        email: `provider${i + 1}@homehub.ie`,
        name: faker.person.fullName(),
        passwordHash,
        role: UserRole.PROVIDER,
      },
    });
    providerUsers.push({ id: user.id, email: user.email });

    const categoryPick = faker.helpers.arrayElements(categoryList, 2);
    const profile = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        businessName: faker.company.name(),
        description: faker.company.catchPhrase(),
        phone: faker.phone.number('+353-8##-###-###'),
        contactEmail: user.email,
        hours: 'Mon-Fri 8am-6pm, Sat 9am-2pm',
        insurance: faker.helpers.maybe(() => 'Public liability insured') ?? null,
        licenseNumber: faker.helpers.maybe(() => `LIC-${faker.number.int({ min: 1000, max: 9999 })}`) ?? null,
        verified: faker.datatype.boolean({ probability: 0.3 }),
      },
    });

    await prisma.providerCategory.createMany({
      data: categoryPick.map((category) => ({
        providerId: profile.id,
        categoryId: category.id,
      })),
    });

    await prisma.coverageArea.createMany({
      data: faker.helpers.arrayElements(counties, 3).map((county) => ({
        providerId: profile.id,
        county,
        town: faker.location.city(),
      })),
    });

    await prisma.providerPhoto.createMany({
      data: [1, 2, 3].map(() => ({
        providerId: profile.id,
        url: `https://res.cloudinary.com/demo/image/upload/v1/sample.jpg`,
      })),
    });
  }

  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const customers = [] as { id: string }[];
  for (let i = 0; i < 10; i += 1) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i + 1}@homehub.ie`,
        name: faker.person.fullName(),
        passwordHash: customerPassword,
        role: UserRole.CUSTOMER,
      },
    });
    customers.push({ id: user.id });
  }

  const providers = await prisma.providerProfile.findMany({ include: { categories: true } });

  for (let i = 0; i < 30; i += 1) {
    const customer = faker.helpers.arrayElement(customers);
    const provider = faker.helpers.arrayElement(providers);
    const category = await prisma.category.findFirst({
      where: { id: provider.categories[0]?.categoryId },
    });

    if (!category) continue;

    const quote = await prisma.quoteRequest.create({
      data: {
        customerId: customer.id,
        categoryId: category.id,
        locationCounty: faker.helpers.arrayElement(counties),
        locationTown: faker.location.city(),
        description: faker.lorem.paragraph(),
        status: QuoteStatus.COMPLETED,
        photos: {
          create: [
            {
              url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
            },
          ],
        },
      },
    });

    const thread = await prisma.quoteThread.create({
      data: {
        quoteRequestId: quote.id,
        providerId: provider.id,
      },
    });

    await prisma.message.createMany({
      data: [
        {
          threadId: thread.id,
          senderId: customer.id,
          body: 'Hi, I would like a quote for this job.',
        },
        {
          threadId: thread.id,
          senderId: provider.userId,
          body: 'Thanks for reaching out! I can help, when can we visit?',
        },
      ],
    });

    await prisma.review.create({
      data: {
        providerId: provider.id,
        customerId: customer.id,
        quoteRequestId: quote.id,
        rating: faker.number.int({ min: 4, max: 5 }),
        comment: faker.lorem.sentences({ min: 1, max: 2 }),
      },
    });
  }

  const providersWithReviews = await prisma.providerProfile.findMany({
    include: { reviews: true },
  });

  for (const provider of providersWithReviews) {
    if (provider.reviews.length === 0) continue;
    const rating =
      provider.reviews.reduce((sum, review) => sum + review.rating, 0) /
      provider.reviews.length;
    await prisma.providerProfile.update({
      where: { id: provider.id },
      data: { rating, reviewCount: provider.reviews.length },
    });
  }

  console.log(`Seed complete: ${categoryRecords.count} categories, ${providerUsers.length} providers, admin ${admin.email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
