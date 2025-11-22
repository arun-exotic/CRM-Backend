import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { CompaniesModule } from './companies/companies.module';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {mount: true},
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContactsModule,
    CompaniesModule,
    DealsModule,
  ],
})
export class AppModule {}
