import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async subscribe(payload: { name: string; email: string }) {
    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();

    if (name.length < 2) {
      throw new BadRequestException('Le prénom est requis (min 2 caractères).');
    }

    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Adresse email invalide.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, email: true },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà inscrit.');
    }

    const subject = 'Bienvenue à la newsletter Tikeoh';
    const html = this.emailService.buildNewsletterWelcomeTemplate({ firstName: name });
    const text = `Bienvenue ${name}, votre inscription à la newsletter Tikeoh est confirmée.`;

    const mailResult = await this.emailService.sendCustomTemplateEmail(email, subject, html, text);

    if (!mailResult.success) {
      this.logger.error(`Newsletter email failed for ${email}: ${mailResult.error}`);
      throw new BadRequestException('Impossible d’envoyer l’email de confirmation pour le moment.');
    }

    return {
      success: true,
      message: 'Inscription newsletter réussie.',
    };
  }
}
