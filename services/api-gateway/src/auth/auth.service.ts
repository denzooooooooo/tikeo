import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
    private emailService: EmailService,
  ) {}

  async register(email: string, password: string, firstName: string, lastName: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const tokens = await this.generateTokens(payload.sub, payload.email);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Always return success to avoid email enumeration
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate a secure random token
      const token = crypto.randomBytes(32).toString('hex');
      const redisKey = `reset:${token}`;

      // Store token in Redis with 1 hour TTL
      await this.redis.set(redisKey, user.id, 3600);

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(normalizedEmail, token);
    }

    return {
      message: 'Si un compte existe pour cet email, vous recevrez les instructions de réinitialisation.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const redisKey = `reset:${token}`;
    const userId = await this.redis.get(redisKey);

    if (!userId) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate the token after use
    await this.redis.del(redisKey);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async validateOAuthUser(profile: any) {
    const { email, firstName, lastName, avatar, provider, providerId } = profile;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { provider: provider, providerId: providerId }
        ]
      },
    });

    if (!user) {
      // Create a random password for OAuth users
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + 'OAuth!', 10);
      
      user = await this.prisma.user.create({
        data: {
          email,
          password: randomPassword,
          firstName: firstName || 'User',
          lastName: lastName || '',
          avatar: avatar || null,
          provider,
          providerId,
          emailVerified: true,
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }
}

