import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersService } from '../src/modules/admin-orders/admin-orders.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { OrderStatus } from '@fashion-store/shared-types';

describe('AdminOrdersService', () => {
  let service: AdminOrdersService;
  let prisma: any;

  const mockOrder = {
    id: 'order-1',
    orderNumber: 'ORD-20260829-0001',
    status: OrderStatus.PENDING_WHATSAPP,
    orderItems: [
      {
        id: 'item-1',
        variantId: 'variant-1',
        quantity: 2,
        productNameSnapshot: 'Oversized Linen Shirt',
        unitPrice: 229000,
        lineTotal: 458000,
      },
    ],
    orderStatusHistories: [],
  };

  beforeEach(async () => {
    const mockTx = {
      order: {
        update: jest.fn().mockImplementation(({ data }) => ({
          ...mockOrder,
          status: data.status,
        })),
      },
      orderStatusHistory: {
        create: jest.fn().mockResolvedValue({ id: 'hist-1' }),
      },
      productVariant: {
        update: jest.fn().mockResolvedValue({ id: 'variant-1', stockQuantity: 12 }),
      },
      inventoryAdjustment: {
        create: jest.fn().mockResolvedValue({ id: 'adj-1' }),
      },
    };

    prisma = {
      order: {
        findMany: jest.fn().mockResolvedValue([mockOrder]),
        count: jest.fn().mockResolvedValue(1),
        findUnique: jest.fn().mockResolvedValue(mockOrder),
      },
      $transaction: jest.fn().mockImplementation(async (cb) => cb(mockTx)),
      mockTx,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrdersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AdminOrdersService>(AdminOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should restock items and log inventory adjustment when order is cancelled', async () => {
    const result = await service.updateStatus(
      'order-1',
      { status: OrderStatus.CANCELLED, note: 'Customer changed mind' },
      'admin-user-1',
    );

    expect(result.status).toBe('cancelled');
    expect(prisma.mockTx.productVariant.update).toHaveBeenCalledWith({
      where: { id: 'variant-1' },
      data: { stockQuantity: { increment: 2 } },
    });
    expect(prisma.mockTx.inventoryAdjustment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        variantId: 'variant-1',
        quantityDelta: 2,
        referenceOrderId: 'order-1',
        adminUserId: 'admin-user-1',
      }),
    });
  });
});
