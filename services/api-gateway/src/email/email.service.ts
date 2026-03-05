import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as QRCode from 'qrcode';

interface TicketData {
  eventTitle: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  orderId: string;
  qrCode?: string;
  ticketId?: string;
  ticketDesign?: {
    template?: string | null;
    backgroundUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    textColor?: string | null;
    showQr?: boolean | null;
    showSeat?: boolean | null;
    showTerms?: boolean | null;
    customTitle?: string | null;
    footerNote?: string | null;
  };
}

interface EventData {
  eventTitle: string;
  eventDate: string;
  venue: string;
  daysUntil: number;
}

interface OrderData {
  orderId: string;
  total: number;
  eventTitle: string;
  ticketCount: number;
}

interface PromoData {
  code: string;
  discount: string;
  validUntil: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private isConfigured = false;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    //优先使用 RESEND_API_KEY (推荐方式)
    const resendApiKey = this.configService.get('RESEND_API_KEY');
    this.fromEmail = this.configService.get('SMTP_FROM') || 'Tikeo <onboarding@resend.dev>';

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.isConfigured = true;
      this.logger.log('✅ Resend email service initialized with RESEND_API_KEY');
    } else {
      // 回退: 尝试使用 SMTP (为了向后兼容)
      const smtpHost = this.configService.get('SMTP_HOST');
      const smtpPort = Number(this.configService.get('SMTP_PORT') || 587);
      const smtpUser = this.configService.get('SMTP_USER');
      const smtpPass = this.configService.get('SMTP_PASS');
      
      if (smtpHost && smtpPort && smtpUser && smtpPass) {
        this.isConfigured = true;
        this.logger.warn(`⚠️ Using SMTP fallback (${smtpHost}:${smtpPort}) - Consider using RESEND_API_KEY instead`);
      } else {
        this.logger.error('❌ No email service configured. Set RESEND_API_KEY or SMTP_* variables.');
      }
    }
  }

  // 获取配置状态 (供 health 检查使用)
  getConfigStatus() {
    const resendApiKey = this.configService.get('RESEND_API_KEY');
    const smtpHost = this.configService.get('SMTP_HOST');
    
    return {
      isConfigured: this.isConfigured,
      provider: resendApiKey ? 'resend' : (smtpHost ? 'smtp' : 'none'),
      fromEmail: this.fromEmail,
      hasResendKey: !!resendApiKey,
      hasSmtp: !!smtpHost,
    };
  }

  private async sendEmail(to: string, subject: string, html: string, text: string) {
    if (!this.isConfigured) {
      this.logger.error('=== EMAIL NOT SENT (NO EMAIL SERVICE CONFIGURED) ===');
      return { success: false, error: 'EMAIL_SERVICE_NOT_CONFIGURED' };
    }

    const replyTo = this.configService.get('SMTP_REPLY_TO');

    if (this.resend) {
      try {
        const result = await this.resend.emails.send({
          from: this.fromEmail,
          to: [to],
          subject,
          html,
          text,
          ...(replyTo ? { replyTo } : {}),
          headers: {
            'X-Entity-Ref-ID': `tikeo-${Date.now()}`,
          },
        });

        if (result.error) {
          this.logger.error(`Failed to send email to ${to}: ${result.error.message}`);
          return { success: false, error: result.error.message };
        }

        this.logger.log(`✅ Email sent successfully to ${to} (id: ${result.data?.id})`);
        return { success: true, messageId: result.data?.id };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to send email to ${to}: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    }

    this.logger.error('=== SMTP NOT IMPLEMENTED IN NEW VERSION ===');
    return { success: false, error: 'SMTP_FALLBACK_NOT_IMPLEMENTED' };
  }

  private getEmailHeader(title: string): string {
    return '<div style="background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); padding: 30px; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 28px;">Tikeo</h1></div>';
  }

  private getEmailFooter(): string {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    return '<div style="background-color: #f9f9f9; padding: 20px; text-align: center;">' +
      '<p style="color: #999999; font-size: 14px; margin: 0;">© ' + new Date().getFullYear() + ' Tikeo. Tous droits réservés.</p>' +
      '<p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">' +
      '<a href="' + baseUrl + '/contact" style="color: #5B7CFF; text-decoration: none;">Contact</a> • ' +
      '<a href="' + baseUrl + '/privacy" style="color: #5B7CFF; text-decoration: none;">Confidentialité</a> • ' +
      '<a href="' + baseUrl + '/cgu" style="color: #5B7CFF; text-decoration: none;">CGU</a></p></div>';
  }

  private getButton(url: string, text: string): string {
    return '<div style="text-align: center; margin: 30px 0;">' +
      '<a href="' + url + '" style="display: inline-block; background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); ' +
      'color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">' +
      text + '</a></div>';
  }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = baseUrl + '/verify-email?token=' + token;
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Vérifiez votre adresse email') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Vérifiez votre adresse email</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Merci de vous être inscrit sur Tikeo! ' +
      'Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>' +
      this.getButton(verifyUrl, 'Vérifier mon email') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Vérifiez votre adresse email - Tikeo', html, 'Verify email: ' + verifyUrl);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = baseUrl + '/reset-password?token=' + token;
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Réinitialisation de mot de passe') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Réinitialisation de mot de passe</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Vous avez demandé la réinitialisation de votre mot de passe. ' +
      'Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expire dans 1 heure.</p>' +
      this.getButton(resetUrl, 'Réinitialiser mon mot de passe') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Réinitialisation de votre mot de passe - Tikeo', html, 'Reset password: ' + resetUrl);
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Bienvenue sur Tikeo!') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Bienvenue ' + firstName + '!</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Nous sommes ravis de vous avoir parmi nous!</p>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 10px 0;">Avec Tikeo, vous pouvez:</p>' +
      '<ul style="color:#666;font-size:16px;line-height:1.8;">' +
      '<li>Découvrir les meilleurs événements près de chez vous</li>' +
      '<li>Acheter vos billets en toute simplicité</li>' +
      '<li>Créer et gérer vos propres événements</li>' +
      '<li>Participer à des concours passionnants</li></ul>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Bienvenue ' + firstName + '! - Tikeo', html, 'Welcome to Tikeo, ' + firstName + '!');
  }

  async sendTicketEmail(email: string, ticketData: TicketData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');

    const qrData = ticketData.qrCode || '';
    const qrImage = qrData ? await QRCode.toDataURL(qrData) : '';
    const design = ticketData.ticketDesign || {};
    const primary = design.primaryColor || '#5B7CFF';
    const secondary = design.secondaryColor || '#7B61FF';
    const customTitle = design.customTitle || 'Billet officiel';
    const footerNote = design.footerNote || 'Merci de présenter ce billet à l\'entrée.';
    const showQr = design.showQr !== false;
    const showTerms = design.showTerms !== false;

    const backgroundImage = design.backgroundUrl
      ? 'background-image:url(\'' + design.backgroundUrl + '\');background-size:cover;background-position:center;'
      : '';
    const textColor = design.textColor || '#FFFFFF';

    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#0f1220;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1220;padding:24px 12px;"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#13172b;border:1px solid #202642;border-radius:16px;overflow:hidden;">' +
      '<tr><td style="background: linear-gradient(135deg, ' + primary + ' 0%, ' + secondary + ' 100%); padding: 26px 28px; text-align: left; color: white;">' +
      '<h1 style="margin:0;font-size:26px;line-height:1.2;">🎫 ' + customTitle + '</h1>' +
      '<p style="margin:8px 0 0 0;opacity:.95;font-size:13px;">Billet officiel Tikeo • Présentez ce QR code à l’entrée</p></td></tr>' +
      '<tr><td style="padding:22px;">' +
      '<div style="border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);' + backgroundImage + '">' +
      '<div style="background:rgba(8,10,16,.72);padding:20px;color:' + textColor + ';">' +
      '<h2 style="margin:0 0 12px 0;font-size:22px;color:#fff;">' + ticketData.eventTitle + '</h2>' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.7;color:#d9e1ff;">' +
      '<tr><td style="padding:3px 0;"><strong>Date</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.eventDate + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Lieu</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.venue + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Type</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.ticketType + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Commande</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.orderId + '</td></tr>' +
      (ticketData.ticketId ? '<tr><td style="padding:3px 0;"><strong>Billet ID</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.ticketId + '</td></tr>' : '') +
      '</table>' +
      '</div></div>' +
      (showQr && qrImage
        ? '<div style="text-align:center;margin:18px 0 10px 0;">' +
          '<div style="display:inline-block;background:#fff;padding:12px;border-radius:12px;border:1px solid #eceff9;">' +
          '<img src="' + qrImage + '" alt="QR Code billet" style="width:180px;height:180px;display:block;" />' +
          '</div></div>'
        : '') +
      (showQr && ticketData.qrCode ? '<p style="color:#96a1c6;font-size:11px;text-align:center;word-break:break-all;margin:8px 0 0 0;">' + ticketData.qrCode + '</p>' : '') +
      '<p style="color:#cfd6f6;font-size:14px;line-height:1.6;margin:18px 0 0 0;">Arrivez 30 minutes avant le début de l’événement pour faciliter le contrôle.</p>' +
      (showTerms ? '<p style="color:#8d98be;font-size:12px;line-height:1.5;margin:12px 0 0 0;">' + footerNote + '</p>' : '') +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Vos billets - ' + ticketData.eventTitle + ' - Tikeo', html, 'Your ticket for ' + ticketData.eventTitle);
  }

  async sendEventReminderEmail(email: string, eventData: EventData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader(eventData.eventTitle + ' commence dans ' + eventData.daysUntil + ' jour(s)!') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Rappel: ' + eventData.eventTitle + '</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Date:</strong> ' + eventData.eventDate + '</p>' +
      '<p style="margin:5px 0;"><strong>Lieu:</strong> ' + eventData.venue + '</p></div>' +
      '<p style="color:#666;font-size:16px;">N\'oubliez pas vos billets!</p>' +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Rappel: ' + eventData.eventTitle + ' - Tikeo', html, 'Reminder: ' + eventData.eventTitle);
  }

  async sendOrderConfirmationEmail(email: string, orderData: OrderData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Confirmation de commande') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Merci pour votre achat!</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Commande:</strong> ' + orderData.orderId + '</p>' +
      '<p style="margin:5px 0;"><strong>Événement:</strong> ' + orderData.eventTitle + '</p>' +
      '<p style="margin:5px 0;"><strong>Billets:</strong> ' + orderData.ticketCount + '</p>' +
      '<p style="margin:5px 0;"><strong>Total:</strong> ' + orderData.total + '€</p></div>' +
      '<p style="color:#666;font-size:16px;">Vos billets vous ont été envoyés par email.</p>' +
      this.getButton(baseUrl + '/orders', 'Voir mes commandes') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Confirmation commande ' + orderData.orderId + ' - Tikeo', html, 'Order confirmed: ' + orderData.orderId);
  }

  async sendPromoCodeEmail(email: string, promoData: PromoData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Nouveau code promo exclusif!') +
      '<tr><td style="padding:40px 30px;text-align:center;">' +
      '<p style="color:#666;font-size:16px;margin:0 0 20px 0;">Nous avons une offre spéciale pour vous!</p>' +
      '<div style="background:linear-gradient(135deg,#5B7CFF,#7B61FF);border-radius:8px;padding:30px;margin:20px 0;">' +
      '<p style="color:white;margin:0;font-size:14px;">Code promo</p>' +
      '<p style="color:white;margin:10px 0;font-size:32px;font-weight:bold;">' + promoData.code + '</p>' +
      '<p style="color:white;margin:0;font-size:18px;">' + promoData.discount + ' de réduction</p></div>' +
      '<p style="color:#666;font-size:16px;">Valide jusqu\'au ' + promoData.validUntil + '</p>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Code promo: ' + promoData.code + ' - Tikeo', html, 'Promo code: ' + promoData.code);
  }
}

