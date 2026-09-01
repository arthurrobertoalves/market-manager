import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StockService } from './stock.service';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('alerts')
  findAlerts(@Query('resolved') resolved?: string) {
    const parsed = resolved === undefined ? undefined : resolved === 'true';
    return this.stockService.findAlerts(parsed);
  }

  @Patch('alerts/:id/resolve')
  resolveAlert(@Param('id') id: string) {
    return this.stockService.resolveAlert(id);
  }
}
