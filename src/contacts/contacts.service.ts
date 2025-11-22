import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { buildPagination } from '../common/pagination';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    const { companyIds = [], ...rest } = dto;

    return this.prisma.contact.create({
      data: {
        ...rest,
        createdById: userId, 
        companies: {
          create: companyIds.map((companyId) => ({ companyId })),
        },
      },
      include: { companies: { include: { company: true } } },
    });
  }

  async findAll(query: any) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    const { page, limit, sortBy, order } = buildPagination(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.contact.findMany({
        where: { createdById: userId }, 
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order } as any,
        include: {
          companies: { include: { company: true } },
          deals: { include: { deal: true } },
        },
      }),
      this.prisma.contact.count({
        where: { createdById: userId }, 
      }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: number) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    const contact = await this.prisma.contact.findFirst({
      where: { id, createdById: userId }, 
      include: {
        companies: { include: { company: true } },
        deals: { include: { deal: true } },
      },
    });

    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async update(id: number, dto: UpdateContactDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    
    const existing = await this.prisma.contact.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    const { companyIds, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (companyIds) {
        await tx.contactCompany.deleteMany({ where: { contactId: id } });
      }

      const updated = await tx.contact.update({
        where: { id },
        data: {
          ...rest,
          ...(companyIds && {
            companies: {
              create: companyIds.map((companyId) => ({ companyId })),
            },
          }),
        },
        include: {
          companies: { include: { company: true } },
          deals: { include: { deal: true } },
        },
      });

      return updated;
    });
  }

  async remove(id: number) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    
    const existing = await this.prisma.contact.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.contact.delete({ where: { id } });
  }
}
