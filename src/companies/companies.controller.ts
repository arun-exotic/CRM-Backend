import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { CompaniesService } from './companies.service';
  import { CreateCompanyDto } from './dto/create-company.dto';
  import { UpdateCompanyDto } from './dto/update-company.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Role } from '../auth/roles.enum';
  
  @Controller('companies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}
  
    @Post()
    @Roles(Role.ADMIN, Role.USER)
    create(@Body() dto: CreateCompanyDto) {
      return this.companiesService.create(dto);
    }
  
    @Get()
    @Roles(Role.ADMIN, Role.USER)
    findAll(@Query() query: any) {
      return this.companiesService.findAll(query);
    }
  
    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.companiesService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(Role.ADMIN, Role.USER)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCompanyDto,
    ) {
      return this.companiesService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.companiesService.remove(id);
    }
  }
  