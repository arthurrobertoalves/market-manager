import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const frios = await prisma.category.upsert({
    where: { name: 'Frios' },
    update: {},
    create: {
      name: 'Frios',
      tags: ['laticinios', 'carnes', 'sem_gluten', 'zero_lactose', 'vegetais', 'doces'],
    },
  });

  const quentes = await prisma.category.upsert({
    where: { name: 'Quentes' },
    update: {},
    create: {
      name: 'Quentes',
      tags: ['sem_gluten', 'zero_lactose', 'vegetais', 'doces'],
    },
  });

  function image(label: string) {
    return `https://placehold.co/300x300/e8e2d8/44403c?text=${encodeURIComponent(label)}`;
  }

  // Código do produto = prefixo da variação/categoria (letras) + sequencial (números),
  // ex: LAT001 para laticínios, DOC002 para doces — não é um código de barras real.
  const products = [
    { code: 'LAT001', name: 'Queijo Muçarela', categoryId: frios.id, tag: 'laticinios', price: 32.9, unit: 'KG', imageUrl: image('Queijo'), stockQuantity: 40, criticalLevel: 5, mediumLevel: 15 },
    { code: 'CAR001', name: 'Presunto Fatiado', categoryId: frios.id, tag: 'carnes', price: 24.5, unit: 'KG', imageUrl: image('Presunto'), stockQuantity: 3, criticalLevel: 5, mediumLevel: 15 },
    { code: 'SGL001', name: 'Iogurte Sem Glúten', categoryId: frios.id, tag: 'sem_gluten', price: 6.9, unit: 'UN', imageUrl: image('Iogurte'), stockQuantity: 12, criticalLevel: 5, mediumLevel: 15 },
    { code: 'ZLA001', name: 'Leite Zero Lactose', categoryId: frios.id, tag: 'zero_lactose', price: 5.5, unit: 'UN', imageUrl: image('Leite'), stockQuantity: 8, criticalLevel: 5, mediumLevel: 15 },
    { code: 'VEG001', name: 'Salada Pronta', categoryId: frios.id, tag: 'vegetais', price: 9.9, unit: 'KG', imageUrl: image('Salada'), stockQuantity: 20, criticalLevel: 5, mediumLevel: 15 },
    { code: 'DOC001', name: 'Mousse de Chocolate', categoryId: frios.id, tag: 'doces', price: 8.9, unit: 'UN', imageUrl: image('Mousse'), stockQuantity: 30, criticalLevel: 5, mediumLevel: 15 },
    { code: 'SGL002', name: 'Pão Sem Glúten', categoryId: quentes.id, tag: 'sem_gluten', price: 14.9, unit: 'UN', imageUrl: image('Pao'), stockQuantity: 4, criticalLevel: 5, mediumLevel: 15 },
    { code: 'ZLA002', name: 'Pizza Zero Lactose', categoryId: quentes.id, tag: 'zero_lactose', price: 28.9, unit: 'UN', imageUrl: image('Pizza'), stockQuantity: 10, criticalLevel: 5, mediumLevel: 15 },
    { code: 'VEG002', name: 'Torta de Legumes', categoryId: quentes.id, tag: 'vegetais', price: 18.5, unit: 'KG', imageUrl: image('Torta'), stockQuantity: 25, criticalLevel: 5, mediumLevel: 15 },
    { code: 'DOC002', name: 'Bolo de Chocolate', categoryId: quentes.id, tag: 'doces', price: 22.0, unit: 'UN', imageUrl: image('Bolo'), stockQuantity: 6, criticalLevel: 5, mediumLevel: 15 },
    { code: 'DOC003', name: 'Coxinha de Frango', categoryId: quentes.id, tag: 'doces', price: 6.5, unit: 'UN', imageUrl: image('Coxinha'), stockQuantity: 50, criticalLevel: 10, mediumLevel: 25 },
    { code: 'ZLA003', name: 'Iogurte Grego Zero Lactose', categoryId: frios.id, tag: 'zero_lactose', price: 7.9, unit: 'UN', imageUrl: image('Iogurte Grego'), stockQuantity: 45, criticalLevel: 5, mediumLevel: 15 },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  const adminPasswordHash = await bcrypt.hash('admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@email.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const funcionarioPasswordHash = await bcrypt.hash('func@123', 10);
  await prisma.user.upsert({
    where: { email: 'func@email.com' },
    update: {},
    create: {
      name: 'Funcionario',
      email: 'func@email.com',
      passwordHash: funcionarioPasswordHash,
      role: 'FUNCIONARIO',
    },
  });

  await prisma.customer.upsert({
    where: { cpf: '00000000000' },
    update: {},
    create: {
      cpf: '00000000000',
    },
  });

  console.log('Seed concluído.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
