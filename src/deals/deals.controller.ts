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
  import { DealsService } from './deals.service';
  import { CreateDealDto } from './dto/create-deal.dto';
  import { UpdateDealDto } from './dto/update-deal.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Role } from '../auth/roles.enum';
  
  @Controller('deals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class DealsController {
    constructor(private readonly dealsService: DealsService) {}
  
    @Post()
    @Roles(Role.ADMIN, Role.USER)
    create(@Body() dto: CreateDealDto) {
      return this.dealsService.create(dto);
    }
  
    @Get()
    @Roles(Role.ADMIN, Role.USER)
    findAll(@Query() query: any) {
      return this.dealsService.findAll(query);
    }
  
    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.dealsService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(Role.ADMIN, Role.USER)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateDealDto,
    ) {
      return this.dealsService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.dealsService.remove(id);
    }
  }
  