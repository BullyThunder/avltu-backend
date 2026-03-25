import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, userID: number) {
    return await this.prisma.order.create({
      data: {
        origin: createOrderDto.origin,
        destination: createOrderDto.destination,
        weight: createOrderDto.weight,
        title: createOrderDto.title,
        author: {
          connect: { id: userID },
        },
      },
    });
  }
  async delete_Order(id: number, userID: number) {
    const deleteItem = await this.prisma.order.findUnique({
      where: {
        id: id,
      },
    });
    if (deleteItem?.userId !== userID) {
      throw new ForbiddenException('Access denied');
    }
    return await this.prisma.order.delete({
      where: {
        id: id,
      },
    });
  }
}
