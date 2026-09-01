import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DashboardService, SalesPeriod } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('products')
  products() {
    return this.dashboardService.products();
  }

  @Get('sales')
  sales(@Query('period') period: SalesPeriod = 'week') {
    return this.dashboardService.sales(period);
  }

  @Get('stock')
  stock() {
    return this.dashboardService.stock();
  }
}
