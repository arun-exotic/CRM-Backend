import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { buildPagination } from '../common/pagination';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDealDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      
      throw new Error('No user in context');
    }

    const { contactIds = [], stage, ...rest } = dto;

    return this.prisma.deal.create({
      data: {
        ...rest,
        createdById: userId,        
        stage: stage || 'OPEN',
        contacts: {
          create: contactIds.map((contactId) => ({ contactId })),
        },
      },
      include: {
        company: true,
        contacts: { include: { contact: true } },
      },
    });
  }

  async findAll(query: any) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    const { page, limit, sortBy, order } = buildPagination(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.deal.findMany({
        where: { createdById: userId },     
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order } as any,
        include: {
          company: true,
          contacts: { include: { contact: true } },
        },
      }),
      this.prisma.deal.count({
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

    const deal = await this.prisma.deal.findFirst({
      where: { id, createdById: userId },   
      include: {
        company: true,
        contacts: { include: { contact: true } },
      },
    });

    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async update(id: number, dto: UpdateDealDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    
    const existing = await this.prisma.deal.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Deal not found');
    }

    const { contactIds, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (contactIds) {
        await tx.dealContact.deleteMany({ where: { dealId: id } });
      }

      const updated = await tx.deal.update({
        where: { id },
        data: {
          ...rest,
          ...(contactIds && {
            contacts: {
              create: contactIds.map((contactId) => ({ contactId })),
            },
          }),
        },
        include: {
          company: true,
          contacts: { include: { contact: true } },
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

    
    const existing = await this.prisma.deal.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Deal not found');
    }

    return this.prisma.deal.delete({ where: { id } });
  }
}
