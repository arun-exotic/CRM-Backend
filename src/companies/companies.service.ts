import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { buildPagination } from '../common/pagination';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      
      throw new Error('No user in context');
    }

    return this.prisma.company.create({
      data: {
        ...dto,
        createdById: userId, 
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
      this.prisma.company.findMany({
        where: { createdById: userId }, 
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order } as any,
        include: {
          contacts: { include: { contact: true } },
          deals: true,
        },
      }),
      this.prisma.company.count({
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

    const company = await this.prisma.company.findFirst({
      where: { id, createdById: userId }, 
      include: {
        contacts: { include: { contact: true } },
        deals: true,
      },
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    // Ensure user owns this company
    const existing = await this.prisma.company.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const userId = this.prisma.getUserId();
    if (!userId) {
      throw new Error('No user in context');
    }

    // Ensure user owns this company
    const existing = await this.prisma.company.findFirst({
      where: { id, createdById: userId },
    });
    if (!existing) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.delete({ where: { id } });
  }
}
