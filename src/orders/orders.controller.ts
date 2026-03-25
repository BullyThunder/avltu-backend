import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { RequestUser } from './interfaces/request-user';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestUser) {
    const userID = req.user.id;
    return this.ordersService.create(createOrderDto, userID);
  }
  @Delete(':id')
  delete(@Req() req: RequestUser, @Param('id', ParseIntPipe) id: number) {
    const userID = req.user.id;
    return this.ordersService.delete_Order(id, userID);
  }
}
