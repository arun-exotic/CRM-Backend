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
  import { ContactsService } from './contacts.service';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { UpdateContactDto } from './dto/update-contact.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Role } from '../auth/roles.enum';
  
  @Controller('contacts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
  
    @Post()
    @Roles(Role.ADMIN, Role.USER)
    create(@Body() dto: CreateContactDto) {
      return this.contactsService.create(dto);
    }
  
    @Get()
    @Roles(Role.ADMIN, Role.USER)
    findAll(@Query() query: any) {
      return this.contactsService.findAll(query);
    }
  
    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.contactsService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(Role.ADMIN, Role.USER)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateContactDto,
    ) {
      return this.contactsService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.contactsService.remove(id);
    }
  }
  