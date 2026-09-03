import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { UpdateAdminProductDto } from './dto/update-admin-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { status?: string; categoryId?: string; q?: string; page?: number; limit?: number }) {
    const { status, categoryId, q, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (status) {
      where.status = status as any;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (q && q.trim() !== '') {
      const search = q.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { skuPrefix: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          productImages: { orderBy: { displayOrder: 'asc' } },
          productVariants: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productImages: { orderBy: { displayOrder: 'asc' } },
        productVariants: {
          include: {
            inventoryAdjustments: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async create(dto: CreateAdminProductDto, adminUserId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" sudah digunakan oleh produk lain`);
    }

    if (dto.variants?.length) {
      const skus = dto.variants.map((v) => v.sku);
      const existingVariant = await this.prisma.productVariant.findFirst({
        where: { sku: { in: skus } },
      });
      if (existingVariant) {
        throw new ConflictException(`SKU "${existingVariant.sku}" sudah digunakan. Silakan gunakan SKU yang berbeda.`);
      }
    }

    let validCategoryId: string | null = null;
    if (dto.categoryId && dto.categoryId.trim() !== '') {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (categoryExists) {
        validCategoryId = categoryExists.id;
      }
    }

    let validAdminUserId: string | null = null;
    if (adminUserId) {
      const adminExists = await this.prisma.adminUser.findUnique({
        where: { id: adminUserId },
      });
      if (adminExists) {
        validAdminUserId = adminExists.id;
      }
    }

    try {
      const createdProduct = await this.prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: dto.name,
            slug: dto.slug,
            categoryId: validCategoryId,
            basePrice: dto.basePrice,
            status: dto.status as any,
            skuPrefix: dto.skuPrefix || null,
            description: dto.description || null,
            attributes: dto.attributes !== undefined ? dto.attributes : {},
          },
        });

        if (dto.images?.length) {
          for (let idx = 0; idx < dto.images.length; idx++) {
            const img = dto.images[idx];
            await tx.productImage.create({
              data: {
                productId: product.id,
                url: img.url,
                altText: img.altText || null,
                isPrimary: img.isPrimary ?? (idx === 0),
                displayOrder: img.displayOrder ?? idx,
              },
            });
          }
        }

        if (dto.variants?.length) {
          for (const v of dto.variants) {
            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                sku: v.sku,
                size: v.size || null,
                color: v.color || null,
                colorHex: v.colorHex || null,
                priceOverride: v.priceOverride || null,
                stockQuantity: v.stockQuantity,
                lowStockThreshold: v.lowStockThreshold || 5,
              },
            });

            if (v.stockQuantity > 0) {
              await tx.inventoryAdjustment.create({
                data: {
                  variantId: variant.id,
                  adminUserId: validAdminUserId,
                  quantityDelta: v.stockQuantity,
                  reason: 'initial restock on creation',
                },
              });
            }
          }
        }

        return product;
      });

      return this.findOne(createdProduct.id);
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const target = (err.meta?.target as string[]) || [];
          throw new ConflictException(`Data dengan nilai yang sama sudah ada (${target.join(', ') || 'duplicate entry'})`);
        }
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateAdminProductDto, adminUserId?: string) {
    const currentProduct = await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.product.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use by another product`);
      }
    }

    if (dto.variants?.length) {
      const skus = dto.variants.map((v) => v.sku);
      const conflictVariant = await this.prisma.productVariant.findFirst({
        where: {
          sku: { in: skus },
          productId: { not: id },
        },
      });
      if (conflictVariant) {
        throw new ConflictException(`SKU "${conflictVariant.sku}" sudah digunakan oleh produk lain.`);
      }
    }

    let validAdminUserId: string | null = null;
    if (adminUserId) {
      const adminExists = await this.prisma.adminUser.findUnique({
        where: { id: adminUserId },
      });
      if (adminExists) {
        validAdminUserId = adminExists.id;
      }
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id },
          data: {
            ...(dto.name ? { name: dto.name } : {}),
            ...(dto.slug ? { slug: dto.slug } : {}),
            ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId || null } : {}),
            ...(dto.basePrice !== undefined ? { basePrice: dto.basePrice } : {}),
            ...(dto.status ? { status: dto.status as any } : {}),
            ...(dto.skuPrefix !== undefined ? { skuPrefix: dto.skuPrefix || null } : {}),
            ...(dto.description !== undefined ? { description: dto.description || null } : {}),
            ...(dto.attributes !== undefined ? { attributes: dto.attributes } : {}),
          },
        });

        if (dto.images !== undefined) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          if (dto.images.length) {
            for (let idx = 0; idx < dto.images.length; idx++) {
              const img = dto.images[idx];
              await tx.productImage.create({
                data: {
                  productId: id,
                  url: img.url,
                  altText: img.altText || null,
                  isPrimary: img.isPrimary ?? (idx === 0),
                  displayOrder: img.displayOrder ?? idx,
                },
              });
            }
          }
        }

        if (dto.variants !== undefined && dto.variants.length > 0) {
          const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
          const incomingSkus = new Set(dto.variants.map((v) => v.sku));

          for (const ev of existingVariants) {
            if (!incomingSkus.has(ev.sku)) {
              const hasOrderItems = await tx.orderItem.count({ where: { variantId: ev.id } });
              if (hasOrderItems > 0) {
                await tx.productVariant.update({
                  where: { id: ev.id },
                  data: { isActive: false },
                });
              } else {
                await tx.cartItem.deleteMany({ where: { variantId: ev.id } });
                await tx.inventoryAdjustment.deleteMany({ where: { variantId: ev.id } });
                await tx.productVariant.delete({ where: { id: ev.id } });
              }
            }
          }

          for (const v of dto.variants) {
            const existing = existingVariants.find(
              (ev) => ev.sku === v.sku || (ev.size === (v.size || null) && ev.color === (v.color || null))
            );

            if (existing) {
              const delta = v.stockQuantity - existing.stockQuantity;
              await tx.productVariant.update({
                where: { id: existing.id },
                data: {
                  sku: v.sku,
                  size: v.size || null,
                  color: v.color || null,
                  colorHex: v.colorHex || null,
                  priceOverride: v.priceOverride || null,
                  stockQuantity: v.stockQuantity,
                  lowStockThreshold: v.lowStockThreshold || 5,
                  isActive: true,
                },
              });

              if (delta !== 0) {
                await tx.inventoryAdjustment.create({
                  data: {
                    variantId: existing.id,
                    adminUserId: validAdminUserId,
                    quantityDelta: delta,
                    reason: 'manual adjustment from product edit',
                  },
                });
              }
            } else {
              const createdVar = await tx.productVariant.create({
                data: {
                  productId: id,
                  sku: v.sku,
                  size: v.size || null,
                  color: v.color || null,
                  colorHex: v.colorHex || null,
                  priceOverride: v.priceOverride || null,
                  stockQuantity: v.stockQuantity,
                  lowStockThreshold: v.lowStockThreshold || 5,
                },
              });

              if (v.stockQuantity > 0) {
                await tx.inventoryAdjustment.create({
                  data: {
                    variantId: createdVar.id,
                    adminUserId: validAdminUserId,
                    quantityDelta: v.stockQuantity,
                    reason: 'initial restock on creation',
                  },
                });
              }
            }
          }
        }
      });

      return this.findOne(id);
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const target = (err.meta?.target as string[]) || [];
          throw new ConflictException(`Data dengan nilai yang sama sudah ada (${target.join(', ') || 'duplicate entry'})`);
        }
      }
      throw err;
    }
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({
      where: { id },
    });
    return { success: true, message: `Product ${id} deleted successfully` };
  }
}
