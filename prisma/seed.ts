import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('your_password_here', salt);
  await prisma.user.create({
    data: {
      email: 'admin@floria.com',
      name: 'Ruslan',
      password: hashedPassword,
      //
      // Не забудь добавить password, если он у тебя обязателен в schema.prisma
    },
  });
  console.log('User is created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
