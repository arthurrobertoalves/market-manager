import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, SaleStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CancelSaleDto } from './dto/cancel-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto, @CurrentUser() user: AuthenticatedUser) {
    return this.salesService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: SaleStatus,
  ) {
    return this.salesService.findAll({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      status,
    });
  }

  @Get('closing')
  @Roles(Role.ADMIN)
  closingReport(@Query('date') date?: string) {
    const parsedDate = date ? new Date(date) : new Date();
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Data inválida.');
    }
    return this.salesService.closingReport(parsedDate);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN)
  cancelSale(@Param('id') id: string, @Body() dto: CancelSaleDto) {
    return this.salesService.cancelSale(id, dto.reason);
  }

  @Patch(':id/items/:itemId/cancel')
  @Roles(Role.ADMIN)
  cancelItem(@Param('id') id: string, @Param('itemId') itemId: string, @Body() dto: CancelSaleDto) {
    return this.salesService.cancelItem(id, itemId, dto.reason);
  }
}
