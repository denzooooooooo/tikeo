import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailService } from '../email/email.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  check() {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = Number(this.configService.get('SMTP_PORT') || 587);
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');
    
    const isConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPass);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tikeo-api-gateway',
      version: '1.0.0',
      smtpConfigured: isConfigured,
      smtpHost: smtpHost || null,
      smtpPort: smtpPort || null,
      smtpFrom: this.configService.get('SMTP_FROM') || 'no-reply@tikeo.co',
    };
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send a test email' })
  async sendTestEmail(@Body() body: { email: string }) {
    if (!body.email) {
      return { success: false, error: 'Email is required' };
    }

    try {
      const result = await this.emailService.sendWelcomeEmail(body.email, 'Test User');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }
}
