import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@fashion-store/shared-types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret && configService.get<string>('NODE_ENV') === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production mode!');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'super-secret-access-token-key-change-in-prod',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.type) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.type === 'admin') {
      const admin = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Admin account inactive or not found');
      }

      const livePermissions = admin.role.rolePermissions.map(
        (rp) => rp.permission.code,
      );

      return {
        userId: admin.id,
        email: admin.email,
        type: 'admin' as const,
        role: admin.role.name,
        permissions: livePermissions,
      };
    }

    if (payload.type === 'customer') {
      const customer = await this.prisma.customer.findUnique({
        where: { id: payload.sub },
      });

      if (!customer) {
        throw new UnauthorizedException('Customer account not found');
      }

      return {
        userId: customer.id,
        email: customer.email || customer.phone,
        type: 'customer' as const,
      };
    }

    throw new UnauthorizedException('Invalid user type');
  }
}
